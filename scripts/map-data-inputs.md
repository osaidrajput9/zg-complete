# data-raw/

Raw Overpass export consumed by `scripts/build-pakistan-map-data.py`.
Not committed (see `.gitignore`) — regenerate it yourself:

1. Run the query in `.cursor/hero-map-patch.md` section 1a against an
   Overpass endpoint (`https://overpass-api.de/api/interpreter` or a
   mirror), using `out geom` so each way includes its coordinates.
2. Save the response as `data-raw/osm-roads.json`.
3. Run `python3 scripts/build-pakistan-map-data.py` from the project
   root — it rewrites `data/pakistan-map.json`'s `roads` array in
   place and prints a vertex-count report.

This sandbox's network egress policy blocks `overpass-api.de` and
every mirror tried (`overpass.kumi.systems`, `lz4.overpass-api.de`,
`overpass.openstreetmap.ru`, `overpass.private.coffee`), so step 1
has to happen outside this environment.
