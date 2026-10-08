# Proposal: PCB return-current simulation visualization elements

Status: proposal; these interfaces are not registered circuit-json schemas yet.

Represent a return-current result, its sampled current field or heatmap image,
and terminal/via annotations so circuit-to-svg can draw PCB simulation overlays
when `showSimulation` and `simulationId` are supplied.

Numerical fields use circuit-json's existing `Asset` type for both external files
and embedded data URLs. **Gzipped JSON arrays** are the recommended initial storage
format; plain JSON is also supported. Asset MIME types determine decoding.
No solver name/version, FEM order, per-result phasor convention, or color-scale
limits are included. Presentation settings belong to the renderer.

## Existing simulation and example

[simulate-return-current](https://github.com/tscircuit/simulate-return-current)
already accepts temporary `simulation_return_current_excitation` elements.
The proposed changes extend that input representation instead of replacing it.

The pinned AM3352 example is `astra/am3352-sbc@0.1.19`, DDR_D12 from U1.K4
to U3.A7, with 5 mA peak at 1 MHz and bottom-layer GND sampling. Its
[preparation audit](https://github.com/tscircuit/simulate-return-current/blob/main/examples/am3352/preparation-audit.json)
has a 500 × 400 grid at 0.2 mm, 185,644 occupied samples, and 0.035 mm bottom
copper. That audit explicitly says no EM solve was performed; it is not a source
of measured DDR current-field values. The frequency is a selected sinusoidal
test, not a reconstructed DDR switching waveform.

The simulator has a frequency-independent image-current approximation and a
frequency-dependent Palace driven Maxwell path. Both can export these elements.
Their solver provenance and diagnostics remain in separate simulation artifacts.

## Proposed types

All coordinates, cell dimensions, and copper thicknesses are in millimeters,
using PCB world coordinates (+X right, +Y up). IDs reference existing circuit
elements; exporters must resolve real IDs rather than persist pin-name placeholders.

```ts
import type { Asset, LayerRef } from "circuit-json";

export type SimulationReturnCurrentContact = {
  x: number;
  y: number;
  layer: LayerRef;
} & (
  | { contact_type: "pcb_port"; pcb_port_id: string }
  | { contact_type: "pcb_via"; pcb_via_id: string }
  | { contact_type: "pcb_copper_pour"; pcb_copper_pour_id: string }
);

// Promote the simulator's temporary input element; retain its existing
// source_port/load_port support when adding the official schema.
export interface SimulationReturnCurrentExcitation {
  type: "simulation_return_current_excitation";
  simulation_return_current_excitation_id: string;
  simulation_experiment_id: string;
  pcb_trace_id: string;
  ground_source_net_id: string;
  current: number; // Signed amperes; peak for AC.
  return_source: SimulationReturnCurrentContact;
  return_sink: SimulationReturnCurrentContact;
  source_port?: SimulationTerminalPort;
  load_port?: SimulationTerminalPort;
}

export interface SimulationTerminalPort {
  signal_pcb_port_id: string;
  reference_pcb_port_id?: string;
  reference_layer: LayerRef;
  resistance: number; // Ohms, positive.
}

export interface SimulationPcbReturnCurrentResult {
  type: "simulation_pcb_return_current_result";
  simulation_pcb_return_current_result_id: string;
  simulation_experiment_id: string;
  pcb_board_id: string;
  simulation_return_current_excitation_ids: string[];
  frequency_hz?: number; // Positive; absent for frequency-independent results.
}

export interface SimulationPcbReturnCurrentField {
  type: "simulation_pcb_return_current_field";
  simulation_pcb_return_current_field_id: string;
  simulation_pcb_return_current_result_id: string;
  layer: LayerRef;
  source_net_id: string;
  field_type: "real" | "complex_phasor";
  min_x: number;
  min_y: number;
  columns: number;
  rows: number;
  cell_width: number;
  cell_height: number;
  copper_thickness: number;
  data_format: "simulation_return_current_grid_json_v1";
  field_asset: Asset; // application/json or application/gzip; external or data URL.
}

export type SimulationReturnCurrentGridJson =
  | {
      field_type: "real";
      sheet_current_x: (number | null)[];
      sheet_current_y: (number | null)[];
    }
  | {
      field_type: "complex_phasor";
      sheet_current_x_real: (number | null)[];
      sheet_current_x_imag: (number | null)[];
      sheet_current_y_real: (number | null)[];
      sheet_current_y_imag: (number | null)[];
    };

export interface SimulationPcbReturnCurrentHeatmap {
  type: "simulation_pcb_return_current_heatmap";
  simulation_pcb_return_current_heatmap_id: string;
  simulation_pcb_return_current_result_id: string;
  layer: LayerRef;
  source_net_id: string;
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
  image_asset: Asset;
}

export interface SimulationReturnCurrentMarkerBase {
  type: "simulation_pcb_return_current_marker";
  simulation_pcb_return_current_marker_id: string;
  simulation_pcb_return_current_result_id: string;
  role:
    | "signal_source"
    | "signal_load"
    | "return_source"
    | "return_sink"
    | "signal_transition"
    | "return_transition";
  label?: string;
  label_x?: number;
  label_y?: number;
}

export type SimulationPcbReturnCurrentMarker =
  | (SimulationReturnCurrentMarkerBase & {
      target_type: "pcb_port";
      pcb_port_id: string;
      layer: LayerRef;
    })
  | (SimulationReturnCurrentMarkerBase & {
      target_type: "pcb_via";
      pcb_via_id: string;
      from_layer: LayerRef;
      to_layer: LayerRef;
    });
```

Add `pcb_return_current` to `simulation_experiment.experiment_type`.
The result links to that experiment; fields, images and markers link to the
result. Multiple results can represent separate frequencies. Multiple layer/net
fields can reference the same result when exported from the same solve.

For positive excitation current, return_source is the reference contact near
the load (where current enters the return conductor); return_sink is near the
driver. These names describe return-current flow, not signal-driver polarity.
For omitted reference pins, identify the actual reference pour underneath the
endpoint. For explicit reference pins, identify the resolved PCB port. The
contact's layer and location must agree with its referenced conductor.

Migration from the temporary excitation requires adding experiment linkage and
resolving contact metadata; bare points are not sufficient official contacts.
Keep source_port/load_port semantics, including termination resistance.

## JSON field format

Resolve field_asset.url, decoding a data URL locally or fetching an external URL.
For application/json, parse the bytes as UTF-8 JSON. For application/gzip,
decompress the gzip bytes once, then parse UTF-8 JSON. The decoded object has
type SimulationReturnCurrentGridJson.
Its field_type must match the parent element. Arrays contain exactly
`columns * rows` entries. Index `row * columns + column` starts at the
bottom-left cell. Its center is:

```text
x = min_x + (column + 0.5) * cell_width
y = min_y + (row    + 0.5) * cell_height
```

All components use sheet-current units A/mm. Each cell has either finite numbers
in every channel or null in every channel. Null means outside the sampled
conductor domain, not zero current. Real grids have two arrays; complex grids
have four. Component arrays avoid repeated coordinates and per-cell object keys;
gzip further reduces size while retaining ordinary JSON precision and
straightforward decoding.

Complex values are always **peak phasors with exp(+jωt)**. This is a format
definition, not repeated metadata. A 5 mA peak sinusoid has 5/√2 mA RMS.
The instantaneous vector at phase φ is:

```text
Kx(φ) = Kx_real * cos(φ) - Kx_imag * sin(φ)
Ky(φ) = Ky_real * cos(φ) - Ky_imag * sin(φ)
```

Heatmap magnitude is `hypot(Kx_real, Kx_imag, Ky_real, Ky_imag) / t`
for complex fields, and `hypot(Kx, Ky) / t` for real fields, where t is
copper thickness. Both are thickness-averaged current density in A/mm².
Complex heatmap magnitude is phase-independent and is not labeled RMS or
instantaneous magnitude. Arrows come from the vector field, not from a gradient
of the scalar heatmap.

FEM order concerns solver basis functions and belongs in diagnostics, not this
rendering contract. Solver identity/version are likewise outside these elements.

## Reusing Asset for fields and images

Existing `src/common/asset.ts` defines Asset as a nested object with required
`project_relative_path`, `url`, and `mimetype`. It is not a standalone element
or an ID-based asset registry. Use it as existing model_asset/image_asset fields do.

Every field uses field_asset; there is no separate embedded-storage variant.
Asset.url may be an external URL or a data URL containing the same file bytes.
Asset.mimetype selects decoding, while data_format specifies the decoded structure.
A .json.gz suffix is a recommended filename convention, not a decoding rule.

Supported field MIME types:

- application/json: UTF-8 JSON.
- application/gzip: gzipped UTF-8 JSON.

For a data URL, its media type must agree with Asset.mimetype. project_relative_path
remains required for both external and embedded assets.

```json
{
  "field_asset": {
    "project_relative_path": "simulations/ddr-d12/bottom.json.gz",
    "url": "https://example.com/simulations/ddr-d12/bottom.json.gz",
    "mimetype": "application/gzip"
  }
}
```

```json
{
  "image_asset": {
    "project_relative_path": "simulations/ddr-d12/bottom.png",
    "url": "https://example.com/simulations/ddr-d12/bottom.png",
    "mimetype": "image/png"
  }
}
```

An embedded field uses the same Asset shape (the base64 below is a placeholder):

```json
{
  "field_asset": {
    "project_relative_path": "simulations/ddr-d12/bottom.json.gz",
    "url": "data:application/gzip;base64,<gzipped-json-bytes>",
    "mimetype": "application/gzip"
  }
}
```

A plain JSON asset can instead use bottom.json and application/json, externally
or as a data:application/json;base64,... URL. For embedded files, base64 is URL
encoding of the file bytes; it does not introduce a separate field schema.

The URLs above are illustrative. An embedded image can use a
`data:image/png;base64,...` URL in image_asset.url with the same required
project-relative path and image/png MIME type. PNG and WebP are the initial
supported image formats. Images contain only the transparent heatmap overlay,
not PCB geometry, arrows, labels or a legend. The top-left pixel maps to
`(min_x, max_y)`. The image is stretched to the exact supplied bounds.

Image meaning matches the magnitude formula above. Presentation settings,
including color scale, are not serialized in these minimal elements. For a
precolored image, palette and scale are baked into its pixels; numerical legend
reconstruction requires separate producer information or a numeric field.

## Renderer and producer behavior

- Require showSimulation=true and simulationId matching simulation_experiment_id.
- Use simulationResultId when an experiment has multiple candidate results.
- Filter by board, layer, and source net.
- A numeric field generates both colors and arrows. Arrows use configurable
  spacing and normalized lengths; complex arrows default to phase 0°.
- A supplied image overrides generated heatmap colors for the same result/layer/net.
  Numeric fields may still supply arrows. Image-only results have no derived arrows.
- Highlight only markers applicable to the rendered layer. Apply the PCB transform
  to vectors and positions; compensate explicitly for image row orientation.
- Resolve external or data URLs through the same asset loader. Use Asset.mimetype
  to select plain JSON parsing or gzip decompression followed by JSON parsing;
  do not infer compression from URL suffixes. External fields need an async
  asset-resolution stage before the synchronous SVG renderer. Gzip application files should be served without
  Content-Encoding:gzip so browsers do not transparently decompress them twice.
- Limit decompressed bytes and validate dimensions/channel counts before allocation.
  Clip numeric cells to the selected net's conductor geometry and board cutouts.

Producer: resolve excitation/contact IDs → solve → resample selected net/layer →
fill masked component arrays → serialize compact JSON → optionally gzip → emit
field_asset with an external or data URL → emit result/field/markers and optional
heatmap image_asset. Gzip is the recommended default.
The grid's sampling pitch is separate from FEM mesh resolution.

Measured via-transfer currents are outside this initial proposal. A via marker
only identifies a transition; it does not assert an integrated current.

## Storage measurements

Benchmark two actual saved Palace cases from simulate-return-current:

| Case                   | Grid / occupied cells |      JSON | Gzip JSON | Float32 + mask | Gzip Float32 + mask | Base64 gzip JSON |
| ---------------------- | --------------------: | --------: | --------: | -------------: | ------------------: | ---------------: |
| explicit-ports-1mhz    |         1,200 / 1,196 | 109,772 B |  46,621 B |       19,286 B |            17,952 B |         62,164 B |
| multilayer-inner2-1mhz |         1,200 / 1,196 | 110,456 B |  45,404 B |       19,286 B |            17,437 B |         60,540 B |

Both cases are 40 × 30 at 0.2 mm with four complex-current channels. Measurements
use Python gzip level 6, compact JSON with original finite numeric values, and
a binary comparison consisting of a cell-occupancy bitmap plus occupied-cell
interleaved little-endian Float32 components. Common element metadata is excluded.
The JSON field_type header is included in the final benchmark.

Gzipped Float32 is about 61–62% smaller (JSON is about 2.6× larger).
Float32 is also a precision reduction: roughly seven significant decimal digits.
As a control, rounding values to Float32 before serializing JSON barely changes
the compressed JSON size (see script output); the difference primarily comes
from representation in these cases.

A rough linear extrapolation to the DDR preparation's 185,644 occupied cells is
about 6.7–6.9 MiB gzipped JSON versus 2.6–2.7 MiB gzipped Float32; embedded
base64 JSON would be about 9.0–9.2 MiB. This is not a DDR-field measurement.
Compression varies with spatial structure, precision, sparsity and grid size.
Start with gzip JSON; consider a versioned binary format only if actual DDR
payloads justify it. Decimal rounding and quantization require explicit error
budgets and are not part of v1.

To reproduce, download the two reference.json files from
`examples/palace/explicit-ports-1mhz/` and
`examples/palace/multilayer-inner2-1mhz/` in simulate-return-current, then run:

```sh
python docs/proposals/return-current-storage-benchmark.py explicit-ports-reference.json multilayer-reference.json
```

## Implementation follow-up

Add Zod schemas, generated/input types, prefixed IDs, and AnyCircuitElement
registration for the proposed elements. Keep spatial results separate from
voltage/current graph unions. Validate scalar values, contact references,
frequency requirements for complex fields, label coordinate pairs, unique IDs,
cross-element board/experiment relationships, and decompressed field structure.
Add meaningful schema/decoding tests and PCB SVG snapshots covering phase changes,
external/data URLs, plain/gzipped JSON, masking and image orientation. No production schemas or
renderer behavior are changed by this proposal PR.

