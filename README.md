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

## Table of Contents

<!-- toc:start -->

- [Circuit JSON Specification `circuit-json`](#circuit-json-specification-circuit-json)
  - [Things You Can Do With Circuit JSON](#things-you-can-do-with-circuit-json)
  - [Table of Contents](#table-of-contents)
  - [Typescript Usage](#typescript-usage)
  - [Source Components](#source-components)
    - [SourceComponentBase](#sourcecomponentbase)
    - [SourceLed](#sourceled)
    - [SourcePort](#sourceport)
    - [SourceSimpleBattery](#sourcesimplebattery)
    - [SourceSimpleCapacitor](#sourcesimplecapacitor)
    - [SourceSimpleChip](#sourcesimplechip)
    - [SourceSimpleCrystal](#sourcesimplecrystal)
    - [SourceSimpleDiode](#sourcesimplediode)
    - [SourceSimpleGround](#sourcesimpleground)
    - [SourceSimpleInductor](#sourcesimpleinductor)
    - [SourceSimplePowerSource](#sourcesimplepowersource)
    - [SourceSimplePushButton](#sourcesimplepushbutton)
    - [SourceSimpleResistor](#sourcesimpleresistor)
    - [SourceTrace](#sourcetrace)
  - [PCB Elements](#pcb-elements)
    - [PcbBoard](#pcbboard)
    - [PcbComponent](#pcbcomponent)
    - [PcbFabricationNotePath](#pcbfabricationnotepath)
    - [PcbFabricationNoteText](#pcbfabricationnotetext)
    - [PcbMissingFootprintError](#pcbmissingfootprinterror)
    - [PcbPlacementError](#pcbplacementerror)
    - [PcbPort](#pcbport)
    - [PcbPortNotMatchedError](#pcbportnotmatchederror)
    - [PcbSilkscreenCircle](#pcbsilkscreencircle)
    - [PcbSilkscreenLine](#pcbsilkscreenline)
    - [PcbSilkscreenOval](#pcbsilkscreenoval)
    - [PcbSilkscreenPath](#pcbsilkscreenpath)
    - [PcbSilkscreenPill](#pcbsilkscreenpill)
    - [PcbSilkscreenRect](#pcbsilkscreenrect)
    - [PcbSilkscreenText](#pcbsilkscreentext)
    - [PcbText](#pcbtext)
    - [PcbTrace](#pcbtrace)
    - [PcbTraceError](#pcbtraceerror)
    - [PcbTraceHint](#pcbtracehint)
    - [PcbVia](#pcbvia)
  - [Schematic Elements](#schematic-elements)
    - [SchematicBox](#schematicbox)
    - [SchematicComponent](#schematiccomponent)
    - [SchematicError](#schematicerror)
    - [SchematicLine](#schematicline)
    - [SchematicPath](#schematicpath)
    - [SchematicPort](#schematicport)
    - [SchematicText](#schematictext)
    - [SchematicTrace](#schematictrace)
    - [SchematicVoltageProbe](#schematicvoltageprobe)

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

<!-- circuit-json-docs:start -->

## Source Components

### SourceComponentBase

```typescript
export interface SourceComponentBase {
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

- Defines an LED component that extends the simple diode

```typescript
/**
 * Defines an LED component that extends the simple diode
 */
export interface SourceLed extends SourceComponentBase {
  ftype: "led"
}
```

### SourcePort

- Defines a source port that can be connected to other components

```typescript
/**
 * Defines a source port that can be connected to other components
 */
export interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id: string
}
```

### SourceSimpleBattery

- Defines a simple battery component

```typescript
/**
 * Defines a simple battery component
 */
export interface SourceSimpleBattery extends SourceComponentBase {
  ftype: "simple_battery"
  capacity: number
}
```

### SourceSimpleCapacitor

- Defines a simple capacitor component

```typescript
/**
 * Defines a simple capacitor component
 */
export interface SourceSimpleCapacitor extends SourceComponentBase {
  ftype: "simple_capacitor"
  capacitance: number
}
```

### SourceSimpleChip

- Defines a simple integrated circuit component

```typescript
/**
 * Defines a simple integrated circuit component
 */
export interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
}
```

### SourceSimpleCrystal

- Defines a simple crystal oscillator component

```typescript
/**
 * Defines a simple crystal oscillator component
 */
export interface SourceSimpleCrystal extends SourceComponentBase {
  ftype: "simple_crystal"
  frequency: number
  load_capacitance?: number
}
```

### SourceSimpleDiode

- Defines a simple diode component

```typescript
/**
 * Defines a simple diode component
 */
export interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
}
```

### SourceSimpleGround

- Defines a simple ground component

```typescript
/**
 * Defines a simple ground component
 */
export interface SourceSimpleGround extends SourceComponentBase {
  ftype: "simple_ground"
}
```

### SourceSimpleInductor

- Defines a simple inductor component

```typescript
/**
 * Defines a simple inductor component
 */
export interface SourceSimpleInductor extends SourceComponentBase {
  ftype: "simple_inductor"
  inductance: number
}
```

### SourceSimplePowerSource

- Defines a simple power source component

```typescript
/**
 * Defines a simple power source component
 */
export interface SourceSimplePowerSource extends SourceComponentBase {
  ftype: "simple_power_source"
  voltage: number
}
```

### SourceSimplePushButton

- Defines a simple push button component

```typescript
/**
 * Defines a simple push button component
 */
export interface SourceSimplePushButton extends SourceComponentBase {
  ftype: "simple_push_button"
}
```

### SourceSimpleResistor

- Defines a simple resistor component

```typescript
/**
 * Defines a simple resistor component
 */
export interface SourceSimpleResistor extends SourceComponentBase {
  ftype: "simple_resistor"
  resistance: number
}
```

### SourceTrace

```typescript
export interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_connectivity_map_key?: string
}
```

## PCB Elements

### PcbBoard

- Defines the board outline of the PCB

```typescript
/**
 * Defines the board outline of the PCB
 */
export interface PcbBoard {
  type: "pcb_board"
  pcb_board_id: string
  width: Length
  height: Length
  thickness: Length
  num_layers: number
  center: Point
  outline?: Point[]
}
```

### PcbComponent

- Defines a component on the PCB

```typescript
/**
 * Defines a component on the PCB
 */
export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}
```

### PcbFabricationNotePath

- Defines a fabrication path on the PCB for fabricators or assemblers

```typescript
/**
 * Defines a fabrication path on the PCB for fabricators or assemblers
 */
export interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcb_fabrication_note_path_id: string
  pcb_component_id: string
  layer: LayerRef
  route: Point[]
  stroke_width: Length
  color?: string
}
```

### PcbFabricationNoteText

- Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators

```typescript
/**
 * Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators
 */
export interface PcbFabricationNoteText {
  type: "pcb_fabrication_note_text"
  pcb_fabrication_note_text_id: string
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

### PcbMissingFootprintError

- Defines a placement error on the PCB

```typescript
/**
 * Defines a placement error on the PCB
 */
export interface PcbMissingFootprintError {
  type: "pcb_missing_footprint_error"
  pcb_missing_footprint_error_id: string
  error_type: "pcb_missing_footprint_error"
  source_component_id: string
  message: string
}
```

### PcbPlacementError

- Defines a placement error on the PCB

```typescript
/**
 * Defines a placement error on the PCB
 */
export interface PcbPlacementError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  message: string
}
```

### PcbPort

- Defines a port on the PCB

```typescript
/**
 * Defines a port on the PCB
 */
export interface PcbPort {
  type: "pcb_port"
  pcb_port_id: string
  source_port_id: string
  pcb_component_id: string
  x: Distance
  y: Distance
  layers: LayerRef[]
}
```

### PcbPortNotMatchedError

- Defines a trace error on the PCB where a port is not matched

```typescript
/**
 * Defines a trace error on the PCB where a port is not matched
 */
export interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  message: string
  pcb_component_ids: string[]
}
```

### PcbSilkscreenCircle

- Defines a silkscreen circle on the PCB

```typescript
/**
 * Defines a silkscreen circle on the PCB
 */
export interface PcbSilkscreenCircle {
  type: "pcb_silkscreen_circle"
  pcb_silkscreen_circle_id: string
  pcb_component_id: string
  center: Point
  radius: Length
  layer: VisibleLayer
}
```

### PcbSilkscreenLine

- Defines a silkscreen line on the PCB

```typescript
/**
 * Defines a silkscreen line on the PCB
 */
export interface PcbSilkscreenLine {
  type: "pcb_silkscreen_line"
  pcb_silkscreen_line_id: string
  pcb_component_id: string
  stroke_width: Distance
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  layer: VisibleLayer
}
```

### PcbSilkscreenOval

- Defines a silkscreen oval on the PCB

```typescript
/**
 * Defines a silkscreen oval on the PCB
 */
export interface PcbSilkscreenOval {
  type: "pcb_silkscreen_oval"
  pcb_silkscreen_oval_id: string
  pcb_component_id: string
  center: Point
  radius_x: Distance
  radius_y: Distance
  layer: VisibleLayer
}
```

### PcbSilkscreenPath

- Defines a silkscreen path on the PCB

```typescript
/**
 * Defines a silkscreen path on the PCB
 */
export interface PcbSilkscreenPath {
  type: "pcb_silkscreen_path"
  pcb_silkscreen_path_id: string
  pcb_component_id: string
  layer: VisibleLayerRef
  route: Point[]
  stroke_width: Length
}
```

### PcbSilkscreenPill

- Defines a silkscreen pill on the PCB

```typescript
/**
 * Defines a silkscreen pill on the PCB
 */
export interface PcbSilkscreenPill {
  type: "pcb_silkscreen_pill"
  pcb_silkscreen_pill_id: string
  pcb_component_id: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}
```

### PcbSilkscreenRect

- Defines a silkscreen rect on the PCB

```typescript
/**
 * Defines a silkscreen rect on the PCB
 */
export interface PcbSilkscreenRect {
  type: "pcb_silkscreen_rect"
  pcb_silkscreen_rect_id: string
  pcb_component_id: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}
```

### PcbSilkscreenText

- Defines silkscreen text on the PCB

```typescript
/**
 * Defines silkscreen text on the PCB
 */
export interface PcbSilkscreenText {
  type: "pcb_silkscreen_text"
  pcb_silkscreen_text_id: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
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

### PcbText

- Defines text on the PCB

```typescript
/**
 * Defines text on the PCB
 */
export interface PcbText {
  type: "pcb_text"
  pcb_text_id: string
  text: string
  center: Point
  layer: LayerRef
  width: Length
  height: Length
  lines: number
  align: "bottom-left"
}
```

### PcbTrace

- Defines a trace on the PCB

```typescript
/**
 * Defines a trace on the PCB
 */
export interface PcbTrace {
  type: "pcb_trace"
  source_trace_id?: string
  pcb_component_id?: string
  pcb_trace_id: string
  /**
   * The order that this trace was routed in. This can be used to debug the
   * autorouter and to understand the trace path better
   *
   * The route_order_index should be relative to a subcircuit
   */
  route_order_index?: number
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  route: Array<PcbTraceRoutePoint>
}

export interface PcbTraceRoutePointWire {
  route_type: "wire"
  x: Distance
  y: Distance
  width: Distance
  start_pcb_port_id?: string
  end_pcb_port_id?: string
  layer: LayerRef
}

export interface PcbTraceRoutePointVia {
  route_type: "via"
  x: Distance
  y: Distance
  from_layer: string
  to_layer: string
}
```

### PcbTraceError

- Defines a trace error on the PCB

```typescript
/**
 * Defines a trace error on the PCB
 */
export interface PcbTraceError {
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

- A hint that can be used during generation of a PCB trace.

```typescript
/**
 * A hint that can be used during generation of a PCB trace.
 */
export interface PcbTraceHint {
  type: "pcb_trace_hint"
  pcb_trace_hint_id: string
  pcb_port_id: string
  pcb_component_id: string
  route: RouteHintPoint[]
}
```

### PcbVia

@deprecated

```typescript
/** @deprecated */
    from_layer: layer_ref.optional(),
    /** @deprecated */
    to_layer: layer_ref.optional(),
    layers: z.array(layer_ref),
    pcb_trace_id: z.string().optional(),
  })
  .describe("Defines a via on the PCB")

export type PcbViaInput = z.input<typeof pcb_via>
type InferredPcbVia = z.infer<typeof pcb_via>

/**
 * Defines a via on the PCB
 */
export interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  x: Distance
  y: Distance
  outer_diameter: Distance
  hole_diameter: Distance
  /** @deprecated */
  from_layer?: LayerRef
  /** @deprecated */
  to_layer?: LayerRef
  layers: LayerRef[]
  pcb_trace_id?: string
}
```

## Schematic Elements

### SchematicBox

```typescript
export interface SchematicBox {
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
export interface SchematicComponent {
  type: "schematic_component"
  rotation: number
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
  >
  box_width?: number
  symbol_name?: string
  port_arrangement?: SchematicPortArrangement
  port_labels?: Record<string, string>
  symbol_display_value?: string
}

export interface SchematicPortArrangementBySize {
  left_size: number
  right_size: number
  top_size?: number
  bottom_size?: number
}

export interface SchematicPortArrangementBySides {
  left_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  right_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  top_side?: { pins: number[]; direction?: "left-to-right" | "right-to-left" }
  bottom_side?: {
    pins: number[]
    direction?: "left-to-right" | "right-to-left"
  }
}
```

### SchematicError

```typescript
export interface SchematicError {
  type: "schematic_error"
  schematic_error_id: string
  error_type: "schematic_port_not_found"
  message: string
}
```

### SchematicLine

```typescript
/**
 * Defines a line on the schematic, this can be used for adding arbitrary lines
 * to a schematic, but don't use it for drawing traces, schematic boxes or where
 * other schematic elements are more appropriate.
 */
export interface SchematicLine {
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
export interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
}
```

### SchematicPort

```typescript
export interface SchematicPort {
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
export interface SchematicText {
  type: "schematic_text"
  schematic_component_id: string
  schematic_text_id: string
  text: string
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor: "center" | "left" | "right" | "top" | "bottom"
  color: string
}
```

### SchematicTrace

```typescript
export interface SchematicTrace {
  type: "schematic_trace"
  schematic_trace_id: string
  source_trace_id: string
  junctions: {
    x: number
    y: number
  }[]
  edges: SchematicTraceEdge[]
}

export interface SchematicTraceEdge {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  is_crossing?: boolean
  from_schematic_port_id?: string
  to_schematic_port_id?: string
}
```

### SchematicVoltageProbe

```typescript
export interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
  voltage?: number
}
```

<!-- circuit-json-docs:end -->
