#!/usr/bin/env python3
"""
build-pakistan-map-data.py

Rebuilds the `roads` array from the Overpass export in
data-raw/osm-roads.json.

Provenance of each piece, since three implementations exist and none
of them was right on every count:

  projection        02-build-roads.py  (Web Mercator -- reproduces
                    every node in .cursor/reference-map-data.json to
                    0.05px; the equirectangular projection in
                    build-pakistan-map-data.ORIGINAL.py lands ~230px
                    away, and a straight-line fit to latitude drifts
                    up to 8.9px at Peshawar)
  chain stitching   this script (shared OSM node ids)
  carriageway dedup this script
  RDP tolerance     02-build-roads.py  (per-length)
  smoothing         02-build-roads.py  (Catmull-Rom -> cubic beziers)
  subpath emission  build-pakistan-map-data.ORIGINAL.py (every chain
                    gets its own M command)
  labels            02-build-roads.py  (matches the reference output)

Ways are joined on shared OSM node ids rather than coordinate
proximity. A motorway is mapped as two parallel one-way carriageways
that both carry the same ref and whose endpoints sit metres apart, so
proximity-joining hops from one carriageway onto the other and walks
back where it came from. Carriageways share no nodes, so id-matching
keeps them apart -- and `drop_coincident_chains` then discards the
duplicate, because at this scale the two run less than a pixel apart
and would otherwise double both the vertex count and the path length
the draw/pulse animations traverse.

Only `roads` is rewritten. dots, outline, nodes and viewBox are passed
through untouched: dots/outline come from the GADM boundary via an
intermediate this repo doesn't have, and the nodes carry hand-curated
rank/note fields that no build script reproduces.

Usage:
    python3 scripts/build-pakistan-map-data.py
"""

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_PATH = ROOT / "data-raw" / "osm-roads.json"
BOUNDARY_PATH = ROOT / "data-raw" / "gadm41_PAK_0.json"
MAP_PATH = ROOT / "data" / "pakistan-map.json"
JS_PATH = ROOT / "data" / "pakistan-map-data.js"

PAD = 26.0            # 02-build-roads.py
DEDUPE_PX = 0.5       # 02-build-roads.py
MIN_CHAIN_PX = 5.0    # 02-build-roads.py
RDP_MIN, RDP_MAX, RDP_DIVISOR = 0.35, 1.2, 300.0  # 02-build-roads.py
COINCIDENT_PX = 1.0   # carriageway dedup: how close counts as "the same line"
COINCIDENT_FRAC = 0.9  # ...and how much of the chain has to be that close


# ---- projection (02-build-roads.py) ------------------------------------

def mercator(lon, lat):
    return math.radians(lon), math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def build_projection(view_w):
    """Web Mercator, fit to the viewBox width with PAD on each side."""
    geom = json.loads(BOUNDARY_PATH.read_text())["features"][0]["geometry"]
    polys = geom["coordinates"]
    rings = [[(c[0], c[1]) for c in r] for p in polys for r in p if len(r) >= 8]
    lons = [c[0] for r in rings for c in r]
    lats = [c[1] for r in rings for c in r]
    mx0, my0 = mercator(min(lons), min(lats))
    mx1, my1 = mercator(max(lons), max(lats))
    scale = (view_w - 2 * PAD) / (mx1 - mx0)

    def project(lon, lat):
        mx, my = mercator(lon, lat)
        return (PAD + (mx - mx0) * scale, PAD + (my1 - my) * scale)

    return project


# ---- road classification ----------------------------------------------

# Labels match .cursor/reference-map-data.json exactly (02-build-roads.py).
CORRIDOR_ROADS = {
    "M-9": "M-9 · Karachi – Hyderabad",
    "N-5": "N-5 · Grand Trunk Road",
    "M-5": "M-5 · Multan – Sukkur",
    "M-4": "M-4 · Pindi Bhattian – Multan",
    "M-3": "M-3 · Lahore – Abdul Hakeem",
    "M-2": "M-2 · Lahore – Islamabad",
}

CONTEXT_ROADS = {
    "M-1", "M-8", "M-10", "M-11", "M-14", "M-15",
    "N-10", "N-15", "N-25", "N-35", "N-40", "N-45", "N-50",
    "N-55", "N-65", "N-70", "N-75", "N-80", "N-85", "N-95", "N-110",
}

ALLOWED_ROADS = set(CORRIDOR_ROADS) | CONTEXT_ROADS


def normalize_ref(ref):
    if not ref:
        return None
    ref = ref.split(";")[0].strip().upper()
    ref = re.sub(r"\s*\(.*\)$", "", ref)             # "M-2 (L)" -> "M-2"
    ref = re.sub(r"^([MN])-?(\d+)$", r"\1-\2", ref)  # "N5" -> "N-5"
    return ref if ref in ALLOWED_ROADS else None


# ---- geometry ----------------------------------------------------------

def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def chain_length(chain):
    return sum(dist(chain[i - 1], chain[i]) for i in range(1, len(chain)))


def dedupe(points, min_dist=DEDUPE_PX):
    if not points:
        return points
    out = [points[0]]
    for p in points[1:]:
        if dist(p, out[-1]) >= min_dist:
            out.append(p)
    return out


def rdp_for(chain):
    """Per-length tolerance: loose on long roads, tight on short ones."""
    return max(RDP_MIN, min(RDP_MAX, chain_length(chain) / RDP_DIVISOR))


def _perp_dist(pt, a, b):
    (x, y), (ax, ay), (bx, by) = pt, a, b
    dx, dy = bx - ax, by - ay
    den = math.hypot(dx, dy)
    if den == 0:
        return math.hypot(x - ax, y - ay)
    return abs(dy * x - dx * y + bx * ay - by * ax) / den


def rdp_iter(points, epsilon):
    """Ramer-Douglas-Peucker, iterative (no recursion limit on long roads)."""
    if len(points) < 3:
        return points[:]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        start, end = stack.pop()
        if end <= start + 1:
            continue
        a, b = points[start], points[end]
        max_dist, index = -1.0, -1
        for i in range(start + 1, end):
            d = _perp_dist(points[i], a, b)
            if d > max_dist:
                max_dist, index = d, i
        if max_dist > epsilon and index >= 0:
            keep[index] = True
            stack.append((start, index))
            stack.append((index, end))
    return [p for p, k in zip(points, keep) if k]


def smooth_chain(pts, tension=0.5):
    """Catmull-Rom through the points, emitted as cubic beziers."""
    if len(pts) < 3:
        return "M%.1f %.1f " % pts[0] + " ".join("L%.1f %.1f" % p for p in pts[1:])
    out = ["M%.1f %.1f" % pts[0]]
    n = len(pts)
    for i in range(n - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < n else pts[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) * tension / 3,
              p1[1] + (p2[1] - p0[1]) * tension / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * tension / 3,
              p2[1] - (p3[1] - p1[1]) * tension / 3)
        out.append("C%.1f %.1f %.1f %.1f %.1f %.1f"
                   % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]))
    return " ".join(out)


# ---- chain building ----------------------------------------------------

def _chain_ways(ways):
    """
    Join ways into chains on shared OSM node ids. `ways` is a list of
    (head_node_id, tail_node_id, points). Never reverses a way, so it
    cannot walk back down an opposing carriageway.
    """
    by_head, by_tail = {}, {}
    for i, (head, tail, _) in enumerate(ways):
        by_head.setdefault(head, []).append(i)
        by_tail.setdefault(tail, []).append(i)

    used = [False] * len(ways)
    chains = []
    for i in range(len(ways)):
        if used[i]:
            continue
        used[i] = True
        head, tail, pts = ways[i]
        chain = list(pts)

        while True:  # forwards: a way starting where this one ends
            nxt = next((j for j in by_head.get(tail, []) if not used[j]), None)
            if nxt is None:
                break
            used[nxt] = True
            _, tail, nxt_pts = ways[nxt]
            chain.extend(nxt_pts[1:])

        while True:  # backwards: a way ending where this one starts
            prev = next((j for j in by_tail.get(head, []) if not used[j]), None)
            if prev is None:
                break
            used[prev] = True
            head, _, prev_pts = ways[prev]
            chain = prev_pts[:-1] + chain

        chains.append(chain)
    return chains


def drop_coincident_chains(chains):
    """
    Discard chains that retrace one already kept -- the opposing
    carriageway of a divided motorway. The two are separate ways
    sharing no nodes, so stitching can't merge them, but they project
    to within a pixel of each other. Left in, they double the vertex
    count and the path length the draw and pulse animations traverse.

    Longest chain wins; a shorter one is dropped when COINCIDENT_FRAC
    of its sampled points lie within COINCIDENT_PX of a kept chain.
    Requiring most of the chain to coincide means roads that merely
    touch at a junction are unaffected.
    """
    cell = COINCIDENT_PX
    kept, index = [], {}

    def add_to_index(chain):
        for p in chain:
            index.setdefault((int(p[0] // cell), int(p[1] // cell)), []).append(p)

    def covered(p):
        cx, cy = int(p[0] // cell), int(p[1] // cell)
        for gx in (cx - 1, cx, cx + 1):
            for gy in (cy - 1, cy, cy + 1):
                for q in index.get((gx, gy), ()):
                    if dist(p, q) <= COINCIDENT_PX:
                        return True
        return False

    for chain in sorted(chains, key=chain_length, reverse=True):
        sample = chain if len(chain) <= 60 else chain[:: len(chain) // 60]
        hits = sum(1 for p in sample if covered(p))
        if kept and hits >= COINCIDENT_FRAC * len(sample):
            continue
        kept.append(chain)
        add_to_index(chain)
    return kept


def build_chains(elements):
    by_ref = {}
    for el in elements:
        if el.get("type") != "way" or "geometry" not in el:
            continue
        ref = normalize_ref((el.get("tags") or {}).get("ref"))
        if not ref:
            continue
        geom = el["geometry"]
        node_ids = el.get("nodes") or []
        if len(geom) < 2:
            continue
        pts = [PROJECT(pt["lon"], pt["lat"]) for pt in geom]
        if len(node_ids) == len(geom):
            head, tail = node_ids[0], node_ids[-1]
        else:
            head, tail = pts[0], pts[-1]
        by_ref.setdefault(ref, []).append((head, tail, pts))

    return {ref: _chain_ways(ways) for ref, ways in by_ref.items()}


PROJECT = None  # set in main() once the viewBox width is known


# ---- corridor depth map ------------------------------------------------

# Distance bands, px, from a dot to the nearest corridor vertex. The dot
# field is drawn brighter, larger and warmer close to the route and fades
# out away from it, so the corridor reads as the map's focal plane rather
# than as a line laid over an evenly-lit field. Styling per band lives in
# PakistanMap.tsx; this only emits which band each dot falls in.
#
# Eight bands, spaced tighter near the route: with four the steps landed
# ~2 dot-spacings apart and read as hard edges rather than a falloff.
DEPTH_BANDS = (12.0, 25.0, 40.0, 58.0, 80.0, 108.0, 145.0)


def depth_band(dot, corridor_pts, cell, grid):
    """Band index for one dot: 0 nearest .. len(DEPTH_BANDS) farthest."""
    x, y = dot
    best = float("inf")
    reach = 0
    max_reach = int(DEPTH_BANDS[-1] // cell) + 1
    cx, cy = int(x // cell), int(y // cell)
    # widen the search ring until the nearest hit can't be beaten
    while reach <= max_reach:
        for gx in range(cx - reach, cx + reach + 1):
            for gy in range(cy - reach, cy + reach + 1):
                # only the newly added ring
                if reach and abs(gx - cx) != reach and abs(gy - cy) != reach:
                    continue
                for px, py in grid.get((gx, gy), ()):
                    d = math.hypot(x - px, y - py)
                    if d < best:
                        best = d
        if best <= reach * cell:
            break
        reach += 1
    for i, edge in enumerate(DEPTH_BANDS):
        if best < edge:
            return i
    return len(DEPTH_BANDS)


def apply_depth(dots, corridor_pts):
    cell = DEPTH_BANDS[0]
    grid = {}
    for p in corridor_pts:
        grid.setdefault((int(p[0] // cell), int(p[1] // cell)), []).append(p)
    return [[d[0], d[1], depth_band(d, corridor_pts, cell, grid)] for d in dots]


def main():
    global PROJECT

    for path in (RAW_PATH, BOUNDARY_PATH, MAP_PATH):
        if not path.exists():
            sys.exit(f"missing {path}")

    existing = json.loads(MAP_PATH.read_text())
    view_w = float(existing["viewBox"].split()[2])
    PROJECT = build_projection(view_w)

    raw = json.loads(RAW_PATH.read_text())
    chains_by_ref = build_chains(raw.get("elements", []))

    missing = ALLOWED_ROADS - set(chains_by_ref)
    if missing:
        print(f"warning: no geometry for {sorted(missing)}", file=sys.stderr)

    roads, report = [], []
    corridor_pts = []
    for ref in sorted(chains_by_ref):
        raw_chains = chains_by_ref[ref]
        chains = drop_coincident_chains(raw_chains)
        dropped = len(raw_chains) - len(chains)

        subpaths, verts = [], 0
        for chain in chains:
            deduped = dedupe(chain)
            if len(deduped) < 2 or chain_length(deduped) < MIN_CHAIN_PX:
                continue
            simplified = rdp_iter(deduped, rdp_for(deduped))
            verts += len(simplified)
            subpaths.append(smooth_chain(simplified))
            if ref in CORRIDOR_ROADS:
                corridor_pts.extend(simplified)
        if not subpaths:
            continue

        kind = "corridor" if ref in CORRIDOR_ROADS else "context"
        roads.append({
            "id": ref,
            "label": CORRIDOR_ROADS.get(ref, ref),
            "path": " ".join(subpaths),
            "type": kind,
        })
        report.append((ref, kind, len(subpaths), verts, dropped))

    existing["roads"] = roads
    existing["dots"] = apply_depth([d[:2] for d in existing["dots"]], corridor_pts)
    MAP_PATH.write_text(json.dumps(existing, separators=(",", ":")))

    JS_PATH.parent.mkdir(parents=True, exist_ok=True)
    JS_PATH.write_text(
        "/* Generated by scripts/build-pakistan-map-data.py from GADM 4.1 PAK_0\n"
        " * (boundary) + OSM Overpass (roads). Do not edit by hand.\n"
        " */\n"
        "window.PAKISTAN_MAP_DATA = "
        + json.dumps(existing, separators=(",", ":"))
        + ";\n"
    )

    report.sort(key=lambda r: (r[1] != "corridor", r[0]))
    print(f"{'road':<8} {'type':<9} {'subpaths':>9} {'vertices':>9} {'dup chains':>11}")
    for ref, kind, n_sub, verts, dropped in report:
        print(f"{ref:<8} {kind:<9} {n_sub:>9} {verts:>9} {dropped:>11}")
    print(f"\n{len(roads)} roads, {sum(r[3] for r in report)} vertices")
    bands = {}
    for d in existing["dots"]:
        bands[d[2]] = bands.get(d[2], 0) + 1
    edges = [f"<{DEPTH_BANDS[0]:.0f}"] + \
            [f"{DEPTH_BANDS[i-1]:.0f}-{DEPTH_BANDS[i]:.0f}" for i in range(1, len(DEPTH_BANDS))] + \
            [f">{DEPTH_BANDS[-1]:.0f}"]
    print("depth bands (px from corridor): " +
          ", ".join(f"{edges[b]} = {bands.get(b, 0)}" for b in range(len(DEPTH_BANDS) + 1)))
    print(f"wrote {MAP_PATH.relative_to(ROOT)} and {JS_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
