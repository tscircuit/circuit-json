# Circuit JSON Specification `circuit-json`

[tscircuit](https://github.com/tscircuit/tscircuit) · [discord](https://tscircuit.com/join)

[![npm version](https://badge.fury.io/js/circuit-json.svg)](https://badge.fury.io/js/circuit-json)

Circuit JSON a compiled intermediary low-level JSON circuit representation. It contains all the information needed to visually represent a schematic, PCB, produce Gerber files, produce bill of materials, run SPICE simulations, view warnings and more. It is designed to easily interoperate with a SQL database.

You can think of Circuit JSON as a big JSON array of "Circuit Elements", each
element can have references to other elements, for example a `source_component`
has a corresponding `pcb_component` representation, which has a corresponding
set of `pcb_ports` and is connected via `pcb_traces`.

If you generated Circuit JSON, you can use a wide range of utilities and libraries
provided by tscircuit. For example, if you want to autoroute a PCB, you could
use Circuit JSON as an input to the [tscircuit dsn-converter](https://github.com/tscircuit/dsn-converter)
to generate a DSN file for [freerouting](https://github.com/freerouting/freerouting), you
could then read the DSN file back to Circuit JSON.

This module has the zod definitions and conversion functions for using circuit json,
and is the primary way that Circuit JSON is defined and maintained.

## Things You Can Do With Circuit JSON

- Generate [Gerber files](https://github.com/tscircuit/circuit-json-to-gerber)
- Generate and read [Specctra DSN Autorouting files](https://github.com/tscircuit/dsn-converter)
- Generate [Pick'n'Place Files](https://github.com/tscircuit/circuit-json-to-pnp)
- Generate [PCB and Schematic SVGs](https://github.com/tscircuit/circuit-to-svg)
- Generate [Bill of Materials](https://github.com/tscircuit/circuit-json-to-bom)
- Generate [SPICE netlists and simulations](https://github.com/tscircuit/circuit-json-to-spice)
- Display [PCBs on the web](https://github.com/tscircuit/pcb-viewer)
- Display [Schematics on the web](https://github.com/tscircuit/schematic-viewer)
- Display [3d models of electronics on the web](https://github.com/tscircuit/3d-viewer)

## Table of Contents

<!-- toc:start -->

- [Circuit JSON Specification `circuit-json`](#circuit-json-specification-circuit-json)

  - [Things You Can Do With Circuit JSON](#things-you-can-do-with-circuit-json)
  - [Typescript Usage](#typescript-usage)

  - [Source Components](#source-components)
    - [SourceComponentBase](#sourcecomponentbase)
    - [SourceLed](#sourceled)
    - [SourcePort](#sourceport)
    - [SourceProjectMetadata](#sourceprojectmetadata)
    - [SourceSimpleBattery](#sourcesimplebattery)
    - [SourceSimpleCapacitor](#sourcesimplecapacitor)
    - [SourceSimpleChip](#sourcesimplechip)
    - [SourceSimpleCrystal](#sourcesimplecrystal)
    - [SourceSimpleDiode](#sourcesimplediode)
    - [SourceSimpleGround](#sourcesimpleground)
    - [SourceSimpleInductor](#sourcesimpleinductor)
    - [SourceSimpleMosfet](#sourcesimplemosfet)
    - [SourceSimplePowerSource](#sourcesimplepowersource)
    - [SourceSimplePushButton](#sourcesimplepushbutton)
    - [SourceSimpleResistor](#sourcesimpleresistor)
    - [SourceSimpleResonator](#sourcesimpleresonator)
    - [SourceSimpleSwitch](#sourcesimpleswitch)
    - [SourceSimpleTransistor](#sourcesimpletransistor)
    - [SourceTrace](#sourcetrace)
  - [PCB Elements](#pcb-elements)
    - [PcbAutoroutingError](#pcbautoroutingerror)
    - [PcbBoard](#pcbboard)
    - [PcbComponent](#pcbcomponent)
    - [PcbFabricationNotePath](#pcbfabricationnotepath)
    - [PcbFabricationNoteText](#pcbfabricationnotetext)
    - [PcbGroup](#pcbgroup)
    - [PcbHole](#pcbhole)
    - [PcbManualEditConflictError](#pcbmanualeditconflicterror)
    - [PcbMissingFootprintError](#pcbmissingfootprinterror)
    - [PcbPlacementError](#pcbplacementerror)
    - [PcbPlatedHole](#pcbplatedhole)
    - [PcbPort](#pcbport)
    - [PcbPortNotMatchedError](#pcbportnotmatchederror)
    - [PcbSilkscreenCircle](#pcbsilkscreencircle)
    - [PcbSilkscreenLine](#pcbsilkscreenline)
    - [PcbSilkscreenOval](#pcbsilkscreenoval)
    - [PcbSilkscreenPath](#pcbsilkscreenpath)
    - [PcbSilkscreenPill](#pcbsilkscreenpill)
    - [PcbSilkscreenRect](#pcbsilkscreenrect)
    - [PcbSilkscreenText](#pcbsilkscreentext)
    - [PcbSolderPaste](#pcbsolderpaste)
    - [PcbText](#pcbtext)
    - [PcbTrace](#pcbtrace)
    - [PcbTraceError](#pcbtraceerror)
    - [PcbTraceHint](#pcbtracehint)
  - [Schematic Elements](#schematic-elements) - [SchematicBox](#schematicbox) - [SchematicComponent](#schematiccomponent) - [SchematicError](#schematicerror) - [SchematicLine](#schematicline) - [SchematicPath](#schematicpath) - [SchematicPort](#schematicport) - [SchematicText](#schematictext) - [SchematicTrace](#schematictrace) - [SchematicVoltageProbe](#schematicvoltageprobe)
  <!-- toc:end -->

## Typescript Usage

```ts
import { any_circuit_element, simple_source_resistor } from "circuit-json"
import type { SourceSimpleResistor } from "circuit-json"

const resistor: SourceSimpleResistor = simple_source_resistor.parse({
  type: "source_component",
  ftype: "simple_resistor",
  source_component_id: "source_component_1",
  name: "R1",
  resistane: "1k",
})

console.log(resistor.resistance) // 1000

// This is the common way to parse/transform any element
any_circuit_element.parse({
  /* ... */
})
```

## Base Units

When there is not a string unit provided, tscircuit assumes the a "base unit" is used.

You can specify circuit json with string units to avoid ambiguity around
units, for example by specifying `{ max_trace_length: "100mm" }` avoids needing to know
the base unit. However if a number is specified, it should be in the base units in the
table below. In this case `{ max_trace_length: 100 }` is equivalent.

The default units when reading a number are defined as follows:

| Measurement Type | Base Unit | Description  |
| ---------------- | --------- | ------------ |
| Length           | mm        | Millimeters  |
| Time             | ms        | Milliseconds |
| Mass             | g         | Grams        |
| Angle            | deg       | Degrees      |
| Frequency        | Hz        | Hertz        |
| Volume           | ml        | Milliliters  |
| Voltage          | V         | Volts        |
| Current          | A         | Amperes      |
| Resistance       | Ω         | Ohms         |
| Capacitance      | F         | Farads       |
| Inductance       | H         | Henries      |

## Element Prefixes

Element prefixes are used to separate data that's used in different contexts. This allows
developers who use Circuit JSON to develop partial implementations with smaller targets in mind.
It can also help simplify JSON elements because schematic and pcb information is not contained
in the same object.

A single `<resistor />` (in tscircuit) will have a corresponding `source_component`, `schematic_component` and `pcb_component`, as well as other elements that may be necessary
to represent it.

There are 3 main element prefixes:

- `source_` - e.g. `source_component` An element that contains information from whatever originally defined the entity. You can think of this as a non-target representations.
  - For example, you might have `supplier_part_numbers` as a property here, since that is
    not strictly related to the `pcb` or the `schematic`.
  - This category sometimes contains information that is relevant to both the `pcb` and the `schematic`
  - This is a somewhat a "Miscellaneous" category, because it contains things from the source
    definition that we wouldn't want to lose.
- `pcb_` - e.g. `pcb_component`, `pcb_port`. Anything required to render the PCB
- `schematic_` - e.g. `schematic_component`. Anything required to render the Schematic

<!-- circuit-json-docs:start -->

## Source Components

### SourceComponentBase

```typescript
interface SourceComponentBase {
  type: "source_component"
  ftype?: string
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<SupplierName, string[]>>
  display_value?: string
}
```

### SourceLed

Defines an LED component that extends the simple diode

```typescript
/** Defines an LED component that extends the simple diode */
interface SourceLed extends SourceComponentBase {
  ftype: "led"
}
```

### SourcePort

Defines a source port that can be connected to other components

```typescript
/** Defines a source port that can be connected to other components */
interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id: string
  subcircuit_id?: string
}
```

### SourceProjectMetadata

```typescript
interface SourceProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  created_at?: string // ISO8601 timestamp
}
```

### SourceSimpleBattery

Defines a simple battery component

```typescript
/** Defines a simple battery component */
interface SourceSimpleBattery extends SourceComponentBase {
  ftype: "simple_battery"
  capacity: number
}
```

### SourceSimpleCapacitor

Defines a simple capacitor component

```typescript
/** Defines a simple capacitor component */
interface SourceSimpleCapacitor extends SourceComponentBase {
  ftype: "simple_capacitor"
  capacitance: number
  max_voltage_rating?: number
  display_capacitance?: string
  max_decoupling_trace_length?: number
}
```

### SourceSimpleChip

Defines a simple integrated circuit component

```typescript
/** Defines a simple integrated circuit component */
interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
}
```

### SourceSimpleCrystal

Defines a simple crystal oscillator component

```typescript
/** Defines a simple crystal oscillator component */
interface SourceSimpleCrystal extends SourceComponentBase {
  ftype: "simple_crystal"
  frequency: number
  load_capacitance?: number
}
```

### SourceSimpleDiode

Defines a simple diode component

```typescript
/** Defines a simple diode component */
interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
}
```

### SourceSimpleGround

Defines a simple ground component

```typescript
/** Defines a simple ground component */
interface SourceSimpleGround extends SourceComponentBase {
  ftype: "simple_ground"
}
```

### SourceSimpleInductor

Defines a simple inductor component

```typescript
/** Defines a simple inductor component */
interface SourceSimpleInductor extends SourceComponentBase {
  ftype: "simple_inductor"
  inductance: number
}
```

### SourceSimpleMosfet

```typescript
/** Defines a simple mosfet component
 * This is a three-pin semiconductor device (source, gate, drain)
 * Pin configuration is handled by the schematic port system */

interface SourceSimpleMosfet extends SourceComponentBase {
  ftype: "simple_mosfet"
  channel_type: "n" | "p"
  mosfet_mode: "enhancement" | "depletion"
}
```

### SourceSimplePowerSource

Defines a simple power source component

```typescript
/** Defines a simple power source component */
interface SourceSimplePowerSource extends SourceComponentBase {
  ftype: "simple_power_source"
  voltage: number
}
```

### SourceSimplePushButton

Defines a simple push button component

```typescript
/** Defines a simple push button component */
interface SourceSimplePushButton extends SourceComponentBase {
  ftype: "simple_push_button"
}
```

### SourceSimpleResistor

Defines a simple resistor component

```typescript
/** Defines a simple resistor component */
interface SourceSimpleResistor extends SourceComponentBase {
  ftype: "simple_resistor"
  resistance: number
  display_resistance?: string
}
```

### SourceSimpleResonator

Defines a simple resonator component

```typescript
/** Defines a simple resonator component */
interface SourceSimpleResonator extends SourceComponentBase {
  ftype: "simple_resonator"
  load_capacitance: number
  equivalent_series_resistance?: number
  frequency: number
}
```

### SourceSimpleSwitch

Defines a simple switch component

```typescript
/** Defines a simple switch component */
interface SourceSimpleSwitch extends SourceComponentBase {
  ftype: "simple_switch"
}
```

### SourceSimpleTransistor

```typescript
/** Defines a simple transistor component
 * This is a three-pin semiconductor device (emitter, base, collector)
 * Pin configuration is handled by the schematic port system */

interface SourceSimpleTransistor extends SourceComponentBase {
  ftype: "simple_transistor"
  transistor_type: "npn" | "pnp"
}
```

### SourceTrace

```typescript
interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  max_length?: number
  display_name?: string
}
```

## PCB Elements

### PcbAutoroutingError

```typescript
interface PcbAutoroutingErrorInterface {
  type: "pcb_autorouting_error"
  pcb_error_id: string
  message: string
}
```

### PcbBoard

Defines the board outline of the PCB

```typescript
/** Defines the board outline of the PCB */
interface PcbBoard {
  type: "pcb_board"
  pcb_board_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  thickness: Length
  num_layers: number
  center: Point
  outline?: Point[]
}
```

### PcbComponent

Defines a component on the PCB

```typescript
/** Defines a component on the PCB */
interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  subcircuit_id?: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}
```

### PcbFabricationNotePath

Defines a fabrication path on the PCB for fabricators or assemblers

```typescript
/** Defines a fabrication path on the PCB for fabricators or assemblers */
interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcb_fabrication_note_path_id: string
  pcb_component_id: string
  subcircuit_id?: string
  layer: LayerRef
  route: Point[]
  stroke_width: Length
  color?: string
}
```

### PcbFabricationNoteText

Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators

```typescript
/** Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators */
interface PcbFabricationNoteText {
  type: "pcb_fabrication_note_text"
  pcb_fabrication_note_text_id: string
  subcircuit_id?: string
  pcb_group_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  layer: VisibleLayer
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  color?: string
}
```

### PcbGroup

Defines a group of components on the PCB

```typescript
/** Defines a group of components on the PCB */
interface PcbGroup {
  type: "pcb_group"
  pcb_group_id: string
  source_group_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  center: Point
  pcb_component_ids: string[]
  name?: string
  description?: string
}
```

### PcbHole

Defines a circular or square hole on the PCB

```typescript
/** Defines a circular or square hole on the PCB */
interface PcbHoleCircleOrSquare {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle" | "square"
  hole_diameter: number
  x: Distance
  y: Distance
}
```

### PcbManualEditConflictError

Error emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates

```typescript
/** Error emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates */
interface PcbManualEditConflictError {
  type: "pcb_manual_edit_conflict_error"
  pcb_error_id: string
  message: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}
```

### PcbMissingFootprintError

Defines a placement error on the PCB

```typescript
/** Defines a placement error on the PCB */
interface PcbMissingFootprintError {
  type: "pcb_missing_footprint_error"
  pcb_missing_footprint_error_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  error_type: "pcb_missing_footprint_error"
  source_component_id: string
  message: string
}
```

### PcbPlacementError

Defines a placement error on the PCB

```typescript
/** Defines a placement error on the PCB */
interface PcbPlacementError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  message: string
}
```

### PcbPlatedHole

Defines a circular plated hole on the PCB

```typescript
/** Defines a circular plated hole on the PCB */
interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
  pcb_group_id?: string
  subcircuit_id?: string
  outer_diameter: number
  hole_diameter: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

interface PcbHoleCircularWithRectPad {
  type: "pcb_plated_hole"
  shape: "circular_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle"
  pad_shape: "rect"
  hole_diameter: number
  rect_pad_width: number
  rect_pad_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}
```

### PcbPort

Defines a port on the PCB

```typescript
/** Defines a port on the PCB */
interface PcbPort {
  type: "pcb_port"
  pcb_port_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  source_port_id: string
  pcb_component_id: string
  x: Distance
  y: Distance
  layers: LayerRef[]
}
```

### PcbPortNotMatchedError

Defines a trace error on the PCB where a port is not matched

```typescript
/** Defines a trace error on the PCB where a port is not matched */
interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  message: string
  pcb_component_ids: string[]
}
```

### PcbSilkscreenCircle

Defines a silkscreen circle on the PCB

```typescript
/** Defines a silkscreen circle on the PCB */
interface PcbSilkscreenCircle {
  type: "pcb_silkscreen_circle"
  pcb_silkscreen_circle_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius: Length
  layer: VisibleLayer
  stroke_width: Length
}
```

### PcbSilkscreenLine

Defines a silkscreen line on the PCB

```typescript
/** Defines a silkscreen line on the PCB */
interface PcbSilkscreenLine {
  type: "pcb_silkscreen_line"
  pcb_silkscreen_line_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  stroke_width: Distance
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  layer: VisibleLayer
}
```

### PcbSilkscreenOval

Defines a silkscreen oval on the PCB

```typescript
/** Defines a silkscreen oval on the PCB */
interface PcbSilkscreenOval {
  type: "pcb_silkscreen_oval"
  pcb_silkscreen_oval_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius_x: Distance
  radius_y: Distance
  layer: VisibleLayer
}
```

### PcbSilkscreenPath

Defines a silkscreen path on the PCB

```typescript
/** Defines a silkscreen path on the PCB */
interface PcbSilkscreenPath {
  type: "pcb_silkscreen_path"
  pcb_silkscreen_path_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayerRef
  route: Point[]
  stroke_width: Length
}
```

### PcbSilkscreenPill

Defines a silkscreen pill on the PCB

```typescript
/** Defines a silkscreen pill on the PCB */
interface PcbSilkscreenPill {
  type: "pcb_silkscreen_pill"
  pcb_silkscreen_pill_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}
```

### PcbSilkscreenRect

Defines a silkscreen rect on the PCB

```typescript
/** Defines a silkscreen rect on the PCB */
interface PcbSilkscreenRect {
  type: "pcb_silkscreen_rect"
  pcb_silkscreen_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
  stroke_width: Length
}
```

### PcbSilkscreenText

Defines silkscreen text on the PCB

```typescript
/** Defines silkscreen text on the PCB */
interface PcbSilkscreenText {
  type: "pcb_silkscreen_text"
  pcb_silkscreen_text_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  ccw_rotation?: number
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
}
```

### PcbSolderPaste

Defines solderpaste on the PCB

```typescript
/** Defines solderpaste on the PCB */
interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}
```

### PcbText

Defines text on the PCB

```typescript
/** Defines text on the PCB */
interface PcbText {
  type: "pcb_text"
  pcb_text_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  text: string
  center: Point
  layer: LayerRef
  width: Length
  height: Length
  lines: number
  // @ts-ignore
  align: "bottom-left"
}
```

### PcbTrace

```typescript
interface PcbTraceRoutePointWire {
  route_type: "wire"
  x: Distance
  y: Distance
  width: Distance
  start_pcb_port_id?: string
  end_pcb_port_id?: string
  layer: LayerRef
}
```

### PcbTraceError

Defines a trace error on the PCB

```typescript
/** Defines a trace error on the PCB */
interface PcbTraceError {
  type: "pcb_trace_error"
  pcb_trace_error_id: string
  error_type: "pcb_trace_error"
  message: string
  center?: Point
  pcb_trace_id: string
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
}
```

### PcbTraceHint

A hint that can be used during generation of a PCB trace.

```typescript
/** A hint that can be used during generation of a PCB trace. */
interface PcbTraceHint {
  type: "pcb_trace_hint"
  pcb_trace_hint_id: string
  pcb_port_id: string
  pcb_component_id: string
  route: RouteHintPoint[]
}
```

## Schematic Elements

### SchematicBox

```typescript
interface SchematicBox {
  type: "schematic_box"
  schematic_component_id: string
  width: number
  height: number
  x: number
  y: number
}
```

### SchematicComponent

```typescript
interface SchematicComponent {
  type: "schematic_component"
  size: Size
  center: Point
  source_component_id: string
  schematic_component_id: string
  pin_spacing?: number
  pin_styles?: Record<
  string,
  {
  left_margin?: number
  right_margin?: number
  top_margin?: number
  bottom_margin?: number
}

interface SchematicPortArrangementBySize {
  left_size: number
  right_size: number
  top_size?: number
  bottom_size?: number
}

interface SchematicPortArrangementBySides {
  left_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
```

### SchematicError

```typescript
interface SchematicError {
  type: "schematic_error"
  schematic_error_id: string
  error_type: "schematic_port_not_found"
  message: string
}
```

### SchematicLine

```typescript
/** Defines a line on the schematic, this can be used for adding arbitrary lines
 * to a schematic, but don't use it for drawing traces, schematic boxes or where
 * other schematic elements are more appropriate. */
interface SchematicLine {
  type: "schematic_line"
  schematic_component_id: string
  x1: number
  x2: number
  y1: number
  y2: number
}
```

### SchematicPath

```typescript
interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
}
```

### SchematicPort

```typescript
interface SchematicPort {
  type: "schematic_port"
  schematic_port_id: string
  source_port_id: string
  schematic_component_id?: string
  center: Point
  facing_direction?: "up" | "down" | "left" | "right"
  distance_from_component_edge?: number
  side_of_component?: "top" | "bottom" | "left" | "right"
  true_ccw_index?: number
  pin_number?: number
  display_pin_label?: string
}
```

### SchematicText

```typescript
interface SchematicText {
  type: "schematic_text"
  schematic_component_id: string
  schematic_text_id: string
  text: string
  position: {
  x: number
  y: number
}
```

### SchematicTrace

```typescript
interface SchematicTraceEdge {
  from: {
  x: number
  y: number
}
```

### SchematicVoltageProbe

```typescript
interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
  voltage?: number
}
```

<!-- circuit-json-docs:end -->
