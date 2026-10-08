# PCB return-current simulation schemas

All schemas and types are exported from `circuit-json` and
`src/simulation/index.ts`. The experiment type is `pcb_return_current`.
The five circuit elements are registered in `any_circuit_element`:

- `simulation_return_current_excitation`: signed excitation in amperes, with
  identified return contacts and optional source/load termination ports.
- `simulation_pcb_return_current_result`: board, experiment, excitation IDs,
  and optional frequency in Hz.
- `simulation_pcb_return_current_field`: layer/net, grid geometry in mm, and a
  plain or gzipped JSON `field_asset`.
- `simulation_pcb_return_current_heatmap`: layer/net, positive image bounds,
  and a PNG/WebP `image_asset`.
- `simulation_pcb_return_current_marker`: a PCB port or via annotation.

These spatial results do not extend the SPICE voltage/current graph unions.
Schemas validate individual elements; resolving referenced elements, board/net
ownership, and frequency requirements across elements is the consumer's responsibility.

## Field assets

`field_asset` reuses the existing Asset shape: `project_relative_path`,
`url`, and `mimetype`. URL values may be external or embedded data URLs.
The schema accepts `application/json` and `application/gzip` and checks
data URL media types against the asset MIME type. Filename extensions do not
select decoding; `.json.gz` is the recommended gzip convention.

The schemas do not fetch URLs, decode base64, or decompress gzip. After resolving
the URL and decoding its bytes according to the MIME type, validate the JSON:

```ts
import {
  getSimulationReturnCurrentGridJsonSchema,
  simulation_pcb_return_current_field,
} from "circuit-json"

const field = simulation_pcb_return_current_field.parse(fieldElement)
// decodedJson comes from UTF-8 JSON, after gunzip for application/gzip assets.
const grid = getSimulationReturnCurrentGridJsonSchema(field).parse(decodedJson)
```

`simulation_return_current_grid_json` can validate a decoded payload without a parent.
It requires equal-length finite/null channels with identical null masks.
`getSimulationReturnCurrentGridJsonSchema(field)` additionally checks the field type
and `columns * rows` channel length. Null means absent conductor, whereas
zero means present conductor carrying no current.

Channels are sheet currents in A/mm, row-major starting at the bottom-left.
Real fields contain `sheet_current_x` and `sheet_current_y`; complex fields
contain real/imaginary channels for each axis. Complex values are peak phasors
using `exp(+jωt)`. Consumers compute instantaneous vectors as
`real * cos(phase) - imag * sin(phase)`; heatmap magnitude is the vector
magnitude divided by copper thickness, in A/mm².

See [the original proposal](proposals/pcb-return-current-visualization.md) for
sampling, image orientation, return-contact polarity and storage measurements.
Asset loading and SVG rendering are separate follow-up work.
