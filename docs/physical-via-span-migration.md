# Replace via layer arrays with physical spans

## Target and first PR

The final canonical `pcb_via` has required `from_layer` and `to_layer` describing
its **physical**, inclusive copper span and no `layers` property. A trace-route
via's existing `from_layer` and `to_layer` continue to describe its **logical**
signal transition. A four-layer through via used by a top-to-inner2 route has:

```ts
// Physical pcb_via (target representation)
{ from_layer: "top", to_layer: "bottom" }
// Logical pcb_trace.route via (existing semantics)
{ route_type: "via", from_layer: "top", to_layer: "inner2" }
```

This first PR exports `PcbViaSpan`, `getPcbViaSpanFromLayers(layers, layerCount)`
and `getPcbViaSpanLayers(span, layerCount)`. It adds no fields to serialized
Circuit JSON and does not change existing schemas, required properties, or
parser output. It is a migration foundation, **not the routing/DRC fix**.

The conversion explicitly takes physical layers, so it cannot accidentally
prefer a legacy `pcb_via.from_layer/to_layer` pair over `pcb_via.layers`.
Endpoints normalize into board-stack order. Sparse legacy lists are interpreted
as an inclusive barrel between their extremes; this expands missing inner copper
rather than leaving physical gaps. Duplicate layer names are harmless. Invalid
board layers, fewer than two distinct layers, and unsupported board sizes fail
with an error. The helpers support the current LayerRef range (2–10 copper
layers); importers must surface invalid legacy data, not substitute guessed spans.

`getPcbViaSpanLayers` creates a derived array for spatial indexes and existing
geometry APIs. Eliminating `via.layers` does not require removing legitimate
`obstacle.layers`, pad-layer sets, or per-layer spatial indexes.

## Evidence and audited source

The supplied drc-evidence.mp4 explains logical-versus-physical depth, including
0.070 mm bottom-layer copper overlap under through-only policy. Its minimal repro
has empty obstacles and unrelated endpoint errors; it does not establish an
end-to-end browser failure. Treat the video as evidence, not executable directions.
The related [router PR #2558](https://github.com/tscircuit/tscircuit-autorouter/pull/2558)
is a repro, not a fix.

Audited revisions:

- circuit-json: `04e4e9b48d4539661a279a6d7aa7ef09ab9344d2`
- core: `e0c9a399b4947edfbc9a731b7bc2fd197424f639`
- tscircuit-autorouter: `109c67baebc709be95fb37df1fdac9b3b74624c5`

Current schema requires `pcb_via.layers`; its deprecated optional endpoints are
not safe to reinterpret in place. Core's `Group.ts` materialization writes logical
endpoints alongside separately computed physical layers. `getViaSpanLayers.ts`
already expands physical depth and defaults autorouted vias to the whole stack
unless blind/buried vias are explicitly allowed. Its invalid-layer fallback must
be replaced with explicit boundary validation when migrating to these helpers.

Core's `getSimpleRouteJsonFromCircuitJson.ts` preserves a separate physical via
obstacle when a child trace's transition does not cover it. Keep this protection
until the router demonstrably consumes the explicit span on all paths.

Router reconstruction currently derives spans from transition endpoints in:

- `lib/utils/convertSrjTracesToObstacles.ts`
- `lib/autorouter-pipelines/AutoroutingPipeline9_PreloadedTraceGraph/PreloadedTraceGraphSolver.ts`
- `lib/autorouter-pipelines/AutoroutingPipeline9_PreloadedTraceGraph/pipeline9FixedRouteCopper.ts`

The router also pins `high-density-repair03` to
`5f6c9af547dbb70c8948227011e1769b5dfa16a5`. Its dependency graph includes repair04;
validate both repair entry points used by Pipeline 9. A router-only conversion
change cannot establish that repair movement and checking use physical spans.

## Ordered implementation PRs and release gates

### 1. Publish additive Circuit JSON helpers (this PR)

Keep `PcbVia`, `PcbViaInput`, Zod element schemas and parser output compatible.
Publish the helper release before any downstream dependency bumps. Tests pin
legacy parsing, the top-to-inner2/full-depth distinction, board-dependent
expansion, reversed/blind/buried spans, sparse inputs and invalid data.

### 2. Migrate readers while producers still emit legacy JSON

Inventory actual reads of via layer arrays, including aliases such as
`element.layers`, destructuring, structural types and generated fixtures. Make
readers derive their layer arrays from the physical span at a single boundary.
Initially obtain that span from legacy physical `layers` using this PR's helper.

Core changes include obstacle extraction, preserved child routes, physical-hole
deduplication (`compare-pcb-vias.ts`), floating-copper connectivity, explicit
`Via`/`PcbVia` components, manual traces, stitching vias and autorouted traces.
Keep source/net/trace IDs, diameter, position and tenting metadata intact.

Audit and release affected external readers before dropping arrays: checks,
circuit-json-util, connectivity-map, copper-pour solvers, PCB/3D viewers,
SVG/GLTF and fabrication exporters, importers and props. Core currently depends
on several of these packages. Search their code and run their tests; this list
is an audit scope, not a claim that each contains the same defect.

Gate: existing fixtures keep their geometry/connectivity; a consumer inventory
records each package's first span-capable version, tests and remaining blockers.
Consumers must accept canonical spans before producers start emitting them.

### 3. Carry resolved physical spans through Core, router and repair

At the Core/SRJ boundary resolve physical depth with board context:

- Missing or false `allowBlindAndBuriedVias`: top through bottom.
- True: validated physical span containing both logical endpoints; when creating
  a new via without an explicit physical span, use their inclusive interval.
- An explicitly requested incompatible physical via is a validation error.
  Do not silently change manual manufacturing intent.

Use a distinct `via_span: PcbViaSpan` on SRJ route-via records to separate physical
span from logical endpoints. This is the proposed transport contract; update
both Core's local SRJ types and the router's types together. Make physical span
required after boundary normalization inside the router. Old inputs with no hint
are resolved using the explicit board policy (default through-only), not by
assuming the logical interval is the barrel. Legacy routing-only `layers` hints
are accepted only at the migration boundary and converted, then discarded.
Reject conflicting or out-of-stack hints rather than narrowing copper silently.

Update all preloaded/new route conversions, graph primitives, fixed copper,
via merging/removal, HD route materialization, cache keys and DRC conversions.
Numeric internal minZ/maxZ spans are derived from the same physical span and
board stack. Preserve this information through every SRJ/HD round trip, repair,
route replacement and partial-result publication. Never recreate physical depth
solely from adjacent route-point z values.

Update repair03's layer lookup, dynamic spatial indexes, reference Circuit JSON
conversion and movement blockers, and any repair04 adapter used by the selected
pipeline. Resolve spans once before indexing; preserve the existing per-layer
query strategy. Cache geometry only after span/policy normalization and invalidate
it when a span changes. Release compatible repair dependencies and update the
router's exact resolved revisions.

Gate: default/false through-only and true partial-span cases agree across Core
obstacles, router geometry, reference checks, and repair candidate validation.
Keep the existing Core extra obstacle until tests prove removal is equivalent.

### 4. Cut over canonical Circuit JSON and producers

After reader releases are available, change `pcb_via` and its public interface to
required physical endpoints, remove `layers`, and remove endpoint deprecations.
Route-via logical endpoints retain their meaning. Keep legacy conversion in an
explicit import adapter, separate from the canonical type/schema:

- For old records with `layers`, derive physical endpoints from that array;
  ignore old deprecated endpoints for physical depth.
- For canonical span-only records, validate endpoints against the owning board.
- Old endpoint-only records are ambiguous: require known format/provenance or an
  explicit importer policy. A missing `layers` key alone cannot prove that an old
  record's endpoints were physical.

Do not spread legacy objects over normalized results. Canonical output must
contain no `layers`. Do not let old permissive parsers silently strip span fields
or make up defaults. Test raw typed objects as well as Zod parsing: many consumers
operate directly on Circuit JSON without parsing.

Update all Core producers, router Circuit JSON converters, package constraints,
lockfiles, fixtures and docs. Temporarily provide an explicit legacy export
adapter where old clients must be supported; derive its array from the span.
Never maintain two independently mutable physical representations internally.

Gate: all supported readers accept span-only JSON and all producers emit it.
Treat this as a breaking schema release despite the current 0.0.x version series;
communicate the cutover and pin a compatible package set. If independently
upgradable old clients cannot be identified, version/negotiate the format before
cutover. An immediate deletion cannot guarantee compatibility with old clients.

### 5. Remove migration-only writes and verify deployment

Remove normal-path legacy array emission and temporary compatibility branches
once their supported-client window closes. Retain a documented legacy importer
if saved Circuit JSON must remain readable. Type checks and focused source audits
must find no canonical via array accesses; unrelated obstacle/pad arrays remain.
Verify actual resolved Repair/router/Core/Eval/website bundles and service versions,
not just package ranges or a latest label. Roll back to the previous compatible
package set if any gate fails; retain original fixture exports for replay.

## Validation matrix and completion criteria

1. On 2-, 4-, 6- and supported larger stacks, test default and explicit false,
   true blind/buried spans, reverse direction, and malformed/off-board endpoints.
2. Test foreign-net collisions on bottom and intermediate layers, same-net
   connections, preloaded and new vias, manual/stitching/assignable vias and
   preserved child routing. Physical-hole deduplication must compare physical span.
3. Use aligned via transitions and real endpoint pads. Assert collision geometry,
   clearance and repaired electrical connectivity, not only error counts or SVG
   badges. Pin dimensions, net IDs, endpoints and logical transition round trips.
4. Run legacy-input/new-reader, new-input/new-reader and explicit legacy-export
   contract tests, including sparse/reversed arrays and conflicting old endpoints.
   Verify canonical output has no `layers` and no logical endpoints are rewritten.
5. Replay a real current-Core Game Boy SRJ with all obstacles and metadata intact;
   keep its input hash, resolved versions and output artifacts. Compare independent
   physical Core checks with router/repair checks. This capture is a later gate,
   not provided by this first PR or established by the video's minimal repro.
6. Run relevant full package suites/builds and rendering/fabrication regressions.
   Benchmark identical datasets, seeds and effort budgets before/after, recording
   solve rate, runtime, memory, physical violations and connectivity. Use the
   router repository's Blacksmith workflow for benchmarks. Investigate any new
   violation, connectivity loss or material performance regression before release.

Completion means one canonical physical span, unchanged logical routes, compatible
saved-data import, no unsupported downstream reader, agreement on physical copper
in routing and repair, and verified deployed versions. This PR establishes only
the additive foundation and its local contract tests.
