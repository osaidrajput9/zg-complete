import mapData from "@/data/pakistan-map.json";

/**
 * PakistanMap — the real thing, not a schematic.
 *
 * Geometry is built from GADM 4.1 for the national boundary and an
 * Overpass export for the motorway and national highway network, then
 * projected and simplified by `scripts/build-pakistan-map-data.py`. The
 * dot field is a point-in-polygon fill of the boundary, each dot banded
 * 0–7 by its distance from the nearest corridor vertex so the route reads
 * as the focal plane and the country recedes behind it.
 *
 * Three scales:
 *
 *   hero      full frame behind the home page headline — dot field,
 *             boundary, the whole road network, and the corridor under a
 *             two-stop bloom. Animated by HeroMotion, which selects the
 *             groups below by id.
 *   corridor  inline diagram on a service page, at about 520px. The dot
 *             field is dropped: at that width its 5,819 circles turn to
 *             mush and cost ~350KB of markup for nothing. Revealed by
 *             MapReveal, which scopes itself to its own subtree.
 *   inset     About, at about half width: the boundary and the three
 *             offices, nothing else. No roads, because this answers
 *             "where are you" rather than "where do you run" — a
 *             corridor here would be the service pages' argument
 *             borrowed onto a page that is not making it.
 *
 * Server component on purpose. The map data is ~175KB and every element
 * below is static, so it renders to HTML on the server and none of the
 * JSON reaches the browser.
 *
 * Amber is the corridor, and this is the only component that draws it.
 */

type Road = { id: string; label: string; path: string; type: string };
type Node = { label: string; x: number; y: number; major?: number };

const { viewBox, dots, outline, roads, nodes } = mapData as unknown as {
  viewBox: string;
  dots: [number, number, number?][];
  outline: string[];
  roads: Road[];
  nodes: Node[];
};

const corridorRoads = roads.filter((r) => r.type === "corridor");
const contextRoads = roads.filter((r) => r.type === "context");

/* Paint order, back to front. The ids are what HeroMotion selects on; the
   corridor's four layers are stacked strokes rather than an SVG blur
   filter — same read, near-zero cost on mid-range mobile. */
const ROAD_LAYERS = [
  { id: "m-ctx", className: "road-ctx" },
  { id: "m-bloom", className: "road-bloom" },
  { id: "m-halo", className: "road-halo" },
  { id: "m-cor", className: "road-cor" },
  { id: "m-pulse", className: "road-pulse" },
] as const;

export default function PakistanMap({
  scale = "hero",
  stops,
  label,
  className = "",
}: {
  scale?: "hero" | "corridor" | "inset";
  /** Corridor and inset scales: the cities this page is about. On a
      corridor everything else on the network drops to an unlabelled
      context marker, so three service pages sharing one motorway spine
      still read differently; on an inset nothing else is drawn at all. */
  stops?: string[];
  /** Corridor scale only: what the diagram shows, for assistive tech.
      The hero's map is decoration beside a headline that already says it,
      so it is hidden rather than announced twice. */
  label?: string;
  className?: string;
}) {
  const isHero = scale === "hero";
  const isInset = scale === "inset";

  /* The hero shows the country; the other two show a named set, so a city
     is major there when this page actually names it. */
  const isMajor = (n: Node) =>
    isHero ? Boolean(n.major) : Boolean(stops?.includes(n.label));

  /* An inset draws only what it names. A corridor keeps the network's own
     major cities as unlabelled landmarks so the route has something to be
     read against. */
  const shown = isHero
    ? nodes
    : isInset
      ? nodes.filter(isMajor)
      : nodes.filter((n) => isMajor(n) || n.major);

  /* Label offsets are attributes in viewBox units, so unlike the stroke
     widths in globals.css they cannot be scaled by a class — the corridor
     scale sets its own, up by the same ~1.5 its type is. */
  const dx = isHero ? 12 : 18;
  const dy = isHero ? 4 : 6;

  /* Faisalabad sits 72 units left of Lahore, so on the molasses corridor
     their two labels print through each other, and on the edible oil one
     — where Lahore is an unlabelled landmark — the label runs through its
     marker. Rather than hard-code the pair, the left-hand city of any
     crowded pair reads leftwards, against every marker rather than only
     the labelled ones. The window is roughly a label's width at 17px, and
     close enough vertically to share a line. */
  const crowded = (n: Node) =>
    shown.some(
      (other) =>
        other !== n &&
        other.x > n.x &&
        other.x - n.x < 115 &&
        Math.abs(other.y - n.y) < 22,
    );

  const svg = (
    <svg
      id={isHero ? "map" : undefined}
      viewBox={viewBox}
      className={
        isHero
          ? "h-[94%] max-h-[980px] w-auto"
          : `map--corridor h-auto w-full overflow-visible${isInset ? " map--inset" : ""}`
      }
      {...(isHero
        ? { "aria-hidden": true }
        : { role: "img" as const, "aria-label": label })}
    >
      {isHero && (
        <g id="m-dots">
          {dots.map(([x, y, depth], i) => (
            <circle key={i} className={`dot dot--d${depth ?? 7}`} cx={x} cy={y} r="1.55" />
          ))}
        </g>
      )}

      <g id={isHero ? "m-outline" : undefined} data-map-outline>
        {outline.map((d, i) => (
          <path key={i} className="map-boundary" d={d} />
        ))}
      </g>

      {/* The road network, in paint order: context behind, then the
          corridor's bloom, halo, stroke and pulse stacked over it. An
          inset draws none of them. */}
      {!isInset &&
        ROAD_LAYERS.map((layer) => (
          <g
            key={layer.id}
            id={isHero ? layer.id : undefined}
            {...(layer.id === "m-ctx"
              ? { "data-map-ctx": true }
              : layer.id === "m-pulse"
                ? { "data-map-pulse": true }
                : { "data-map-cor": true })}
          >
            {(layer.id === "m-ctx" ? contextRoads : corridorRoads).map((r) => (
              <path key={r.id} className={layer.className} d={r.path} data-id={r.id} />
            ))}
          </g>
        ))}

      <g id={isHero ? "m-nodes" : undefined}>
        {shown.map((n) => {
          const major = isMajor(n);
          return (
            <g key={n.label} data-map-node>
              {major ? <circle className="map-ring" cx={n.x} cy={n.y} r="9" /> : null}
              <circle
                className={major ? "core" : "core-min"}
                cx={n.x}
                cy={n.y}
                r={major ? 3.4 : 2}
              />
              {/* On a corridor diagram an off-route city is a landmark, not
                  a stop: it keeps its marker and loses its label, so the
                  route's own names stay readable at 520px. */}
              {isHero || major ? (
                <text
                  className="clabel"
                  x={crowded(n) ? n.x - dx : n.x + dx}
                  y={n.y + dy}
                  textAnchor={crowded(n) ? "end" : undefined}
                >
                  {n.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );

  if (!isHero) return svg;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] flex items-center justify-end pr-[2vw] max-[900px]:justify-center max-[900px]:pr-0 max-[900px]:opacity-30 ${className}`.trim()}
      aria-hidden="true"
    >
      {svg}
    </div>
  );
}
