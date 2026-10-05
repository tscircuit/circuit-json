# PCB stackup

`pcb_board.stackup` optionally records a board's physical copper and dielectric
sequence, in order from top to bottom. It belongs only to that `pcb_board`, including
when several boards or isolated subcircuits appear in one Circuit JSON document.
It does not assign signal, ground, power, or reference-plane roles to copper.

Existing boards need no changes. Omitting `stackup` means the stackup is unknown:
`material: "fr4"`, `num_layers`, `thickness`, and manufacturing DRC tolerances do
not establish a particular construction, dielectric spacing, or permittivity.

## Physical layers and units

- Copper entries identify an existing `LayerRef`. The copper sequence must be
  `top`, `inner1`, `inner2`, ..., `bottom`, without duplicates or gaps. A single
  copper layer is `top`. The current layer vocabulary supports up to ten copper
  layers.
- Each pair of copper layers must have at least one dielectric entry between them.
  Multiple consecutive dielectrics can describe multiple prepreg sheets or material
  constructions. Dielectrics outside the first/last copper are outside this model.
- `thickness_mm` is a finite positive **number in millimeters**, with no string or
  copper-weight conversion. Copper thickness is nominal finished conductor
  thickness. Dielectric thickness is nominal thickness after pressing, excluding
  copper. A catalog's core thickness **including copper** must be split before
  serialization; copper must not be counted twice.
- Dielectric `dielectric_type` optionally distinguishes `core` and `prepreg`.
  `material` is an optional product/construction label, such as `7628*1`; it does
  not supply a dielectric constant.
- `dielectric_constant` is finite positive dimensionless relative permittivity
  (Er), not effective trace permittivity. `dielectric_constant_frequency_hz`, if
  known, gives its frequency in hertz and requires `dielectric_constant`. An
  omitted frequency is unknown; a supplied Er is not a claim of broadband accuracy.

All physical quantities and material labels are optional. Omission means unknown,
not zero, a default FR4 Er, or a uniform distribution of the board thickness.
The layer sequence itself must be complete; unknown copper gaps still need a
`{ "type": "dielectric" }` entry.

This initial representation covers the copper/laminate sequence. It excludes
exterior substrate on single-sided boards, solder mask, coverlay, surface finishes,
regional rigid-flex constructions, manufacturing tolerances, and electrical usage.
It does not assert that a copper layer is a continuous reference plane, connected
to a particular net, or suitable for a DDR signal's return path.

## Provenance

`source` is required:

- `specified`: the physical order and supplied quantities were declared by the
  producer/user or transcribed from a named construction. This is a supplied
  design assertion, not evidence that the board was manufactured or measured that
  way, and does not mean all quantities are known.
- `assumed`: any part of the physical order or supplied quantities was guessed or
  chosen as an analysis assumption. If specified and assumed quantities are mixed,
  mark the entire model `assumed`. This first representation has no field-level
  provenance.

Optional `manufacturer`, `manufacturer_stackup_id`, and `source_url` identify the
source construction. A catalog ID requires a manufacturer, is opaque and scoped to
that manufacturer, and does not cause a lookup or populate missing fields. A URL
or catalog ID does not turn an assumed model into a specified or verified one.

## Example and board consistency

The following example transcribes the nominal four-layer `JLC04161H-7628`
construction in [JLCPCB's stackup catalog](https://jlcpcb.com/impedance). The Er
frequencies and the specific core product are not supplied here, so they remain
absent. These catalog numbers are not defaults for other FR4 boards.

```ts
import { pcb_board, validatePcbBoardStackup } from "circuit-json"

const board = pcb_board.parse({
  type: "pcb_board",
  pcb_board_id: "pcb_board_1",
  center: { x: 0, y: 0 },
  material: "fr4",
  thickness: 1.6,
  num_layers: 4,
  stackup: {
    source: "specified",
    manufacturer: "JLCPCB",
    manufacturer_stackup_id: "JLC04161H-7628",
    source_url: "https://jlcpcb.com/impedance",
    layers: [
      { type: "copper", layer: "top", thickness_mm: 0.035 },
      {
        type: "dielectric",
        dielectric_type: "prepreg",
        material: "7628*1",
        thickness_mm: 0.2104,
        dielectric_constant: 4.4,
      },
      { type: "copper", layer: "inner1", thickness_mm: 0.0152 },
      {
        type: "dielectric",
        dielectric_type: "core",
        thickness_mm: 1.065,
        dielectric_constant: 4.6,
      },
      { type: "copper", layer: "inner2", thickness_mm: 0.0152 },
      {
        type: "dielectric",
        dielectric_type: "prepreg",
        material: "7628*1",
        thickness_mm: 0.2104,
        dielectric_constant: 4.4,
      },
      { type: "copper", layer: "bottom", thickness_mm: 0.035 },
    ],
  },
})

validatePcbBoardStackup(board)
```

`pcb_board.parse` and `any_circuit_element.parse` validate the nested stackup's
shape, order, separators, quantities, and provenance. They preserve `pcb_board`'s
existing object-schema API and defaults, and **do not check agreement with
`num_layers`**. Call `validatePcbBoardStackup` on the parsed board before consuming
its stackup; it throws on a copper-count mismatch and does nothing if no stackup
is present. Producers should always supply the corresponding `num_layers`.
For example, a six-layer stackup with omitted `num_layers` parses with the legacy
default of four, and the helper rejects it. Consumers must not silently choose
between contradictory declarations.

The helper does not compare the sum of nominal layer thicknesses with nominal
`pcb_board.thickness`: finishes, pressing, rounding, and manufacturer tolerances
can affect that relationship. Source-specific checks remain the consumer's
responsibility. [Multi-CB's catalog](https://www.multi-circuit-boards.eu/en/pcb-design-aid/layer-buildup/standard-buildup.html)
also distinguishes variable, defined, and custom buildups; its published prepreg
dimensions describe conditions after pressing rather than guaranteed measurements.

## Producer integration

This schema does not change `@tscircuit/props` or `@tscircuit/core`. A follow-up can
add a board input, normalize unit strings/catalog records at that boundary, pass
the physical sequence through board rendering, and validate copper-count agreement
before export. Fabricator presets currently select manufacturing checks; they
must not be treated as exact stackup IDs. Analyzer consumption is a separate
change and must keep geometry, electrical reference selection, and protocol
identification distinct from this physical metadata.
