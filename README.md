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
    - [SourceGroup](#sourcegroup)
    - [SourceLed](#sourceled)
    - [SourceNet](#sourcenet)
    - [SourcePort](#sourceport)
    - [SourceSimpleBattery](#sourcesimplebattery)
    - [SourceSimpleCapacitor](#sourcesimplecapacitor)
    - [SourceSimpleChip](#sourcesimplechip)
    - [SourceSimpleCrystal](#sourcesimplecrystal)
    - [SourceSimpleDiode](#sourcesimplediode)
    - [SourceSimpleGround](#sourcesimpleground)
    - [SourceSimpleInductor](#sourcesimpleinductor)
    - [SourceSimplePinHeader](#sourcesimplepinheader)
    - [SourceSimplePotentiometer](#sourcesimplepotentiometer)
    - [SourceSimplePowerSource](#sourcesimplepowersource)
    - [SourceSimplePushButton](#sourcesimplepushbutton)
    - [SourceSimpleResistor](#sourcesimpleresistor)
    - [SourceTrace](#sourcetrace)
  - [PCB Elements](#pcb-elements)
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
  - [PcbRouteHints](#pcbroutehints)
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
  - [PcbVia](#pcbvia)
  - [Schematic Elements](#schematic-elements) - [SchematicBox](#schematicbox) - [SchematicComponent](#schematiccomponent) - [SchematicDebugObject](#schematicdebugobject) - [SchematicError](#schematicerror) - [SchematicLine](#schematicline) - [SchematicNetLabel](#schematicnetlabel) - [SchematicPath](#schematicpath) - [SchematicPort](#schematicport) - [SchematicText](#schematictext) - [SchematicTrace](#schematictrace) - [SchematicVoltageProbe](#schematicvoltageprobe)
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

### SourceGroup

```typescript
export type SourceGroup = z.infer<typeof source_group>
e
```

### SourceLed

```typescript
export type SourceLedInput = z.input<typeof source_led>
t

export type SourceLedInput = z.input<typeof source_led>
t
```

### SourceNet

```typescript
export type SourceNet = z.infer<typeof source_net>
e
```

### SourcePort

```typescript
export type SourcePortInput = z.input<typeof source_port>
t

export type SourcePortInput = z.input<typeof source_port>
t
```

### SourceSimpleBattery

```typescript
export type SourceSimpleBatteryInput = z.input<typeof source_simple_battery>
t

export type SourceSimpleBatteryInput = z.input<typeof source_simple_battery>
t
```

### SourceSimpleCapacitor

```typescript
export type SourceSimpleCapacitorInput = z.input<typeof source_simple_capacitor>
t

export type SourceSimpleCapacitorInput = z.input<typeof source_simple_capacitor>
t
```

### SourceSimpleChip

```typescript
export type SourceSimpleChipInput = z.input<typeof source_simple_chip>
t

export type SourceSimpleChipInput = z.input<typeof source_simple_chip>
t
```

### SourceSimpleCrystal

```typescript
export type SourceSimpleCrystalInput = z.input<typeof source_simple_crystal>
t

export type SourceSimpleCrystalInput = z.input<typeof source_simple_crystal>
t
```

### SourceSimpleDiode

```typescript
export type SourceSimpleDiodeInput = z.input<typeof source_simple_diode>
t

export type SourceSimpleDiodeInput = z.input<typeof source_simple_diode>
t
```

### SourceSimpleGround

```typescript
export type SourceSimpleGroundInput = z.input<typeof source_simple_ground>
t

export type SourceSimpleGroundInput = z.input<typeof source_simple_ground>
t
```

### SourceSimpleInductor

```typescript
export type SourceSimpleInductorInput = z.input<typeof source_simple_inductor>
t

export type SourceSimpleInductorInput = z.input<typeof source_simple_inductor>
t
```

### SourceSimplePinHeader

```typescript
export type SourceSimplePinHeader = z.infer<typeof source_simple_pin_header>
e
```

### SourceSimplePotentiometer

```typescript
export type SourceSimplePotentiometer = z.infer<


export type SourceSimplePotentiometerInput = z.input<

```

### SourceSimplePowerSource

```typescript
export type SourceSimplePowerSourceInput = z.input<


export type SourceSimplePowerSourceInput = z.input<

```

### SourceSimplePushButton

```typescript
export type SourceSimplePushButtonInput = z.input<


export type SourceSimplePushButtonInput = z.input<

```

### SourceSimpleResistor

```typescript
export type SourceSimpleResistorInput = z.input<typeof source_simple_resistor>
t

export type SourceSimpleResistorInput = z.input<typeof source_simple_resistor>
t
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

export type PcbBoardInput = z.input<typeof pcb_board>
t
```

### PcbComponent

```typescript
export type PcbComponentInput = z.input<typeof pcb_component>
t

export type PcbComponentInput = z.input<typeof pcb_component>
t
```

### PcbFabricationNotePath

```typescript
export type PcbFabricationNotePathInput = z.input<


export type PcbFabricationNotePathInput = z.input<

```

### PcbFabricationNoteText

```typescript
export type PcbFabricationNoteTextInput = z.input<


export type PcbFabricationNoteTextInput = z.input<

```

### PcbGroup

```typescript
export type PcbGroupInput = z.input<typeof pcb_group>
t

export type PcbGroupInput = z.input<typeof pcb_group>
t
```

### PcbHole

```typescript
export type PcbHoleCircleOrSquareInput = z.input<


export type PcbHoleCircleOrSquareInput = z.input<


/**
 * Defines a circular or square hole on the PCB
 */
export interface PcbHoleCircleOrSquare {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "circle" | "square"
  hole_diameter: number
  x: Distance
  y: Distance
}

export type PcbHoleOvalInput = z.input<typeof pcb_hole_oval>
t

/**
 * Defines an oval hole on the PCB
 */
export interface PcbHoleOval {
  type: "pcb_hole"
  pcb_hole_id: string
  hole_shape: "oval"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
}

/**
 * @deprecated Use PcbHoleCircleOrSquare or PcbHoleOval
 */
export type PCBHoleInput = z.input<typeof pcb_hole>
/

export type PCBHole = z.infer<typeof pcb_hole>

```

### PcbManualEditConflictError

```typescript
export type PcbManualEditConflictErrorInput = z.input<


export type PcbManualEditConflictErrorInput = z.input<

```

### PcbMissingFootprintError

```typescript
export type PcbMissingFootprintErrorInput = z.input<


export type PcbMissingFootprintErrorInput = z.input<

```

### PcbPlacementError

```typescript
export type PcbPlacementErrorInput = z.input<typeof pcb_placement_error>
t

export type PcbPlacementErrorInput = z.input<typeof pcb_placement_error>
t
```

### PcbPlatedHole

- Defines a circular plated hole on the PCB

```typescript
/**
 * Defines a circular plated hole on the PCB
 */
export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
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

/**
 * Defines a circular plated hole on the PCB
 */
export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
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

/**
 * Defines an oval or pill-shaped plated hole on the PCB
 */
export interface PcbPlatedHoleOval {
  type: "pcb_plated_hole"
  shape: "oval" | "pill"
  outer_width: number
  outer_height: number
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

/**
 * @deprecated use PcbPlatedHoleInput
 */
export type PCBPlatedHoleInput = z.input<typeof pcb_plated_hole>
e
```

### PcbPort

```typescript
export type PcbPortInput = z.input<typeof pcb_port>
t

export type PcbPortInput = z.input<typeof pcb_port>
t

/**
 * @deprecated use PcbPortInput
 */
export type PCBPortInput = PcbPortInput
```

### PcbPortNotMatchedError

```typescript
export type PcbPortNotMatchedErrorInput = z.input<


export type PcbPortNotMatchedErrorInput = z.input<

```

### PcbRouteHints

```typescript
export type PcbRouteHintsInput = z.input<typeof pcb_route_hints>
e

export type PcbRouteHintInput = z.input<typeof pcb_route_hint>
e

export type PcbRouteHint = z.output<typeof pcb_route_hint>
e
```

### PcbSilkscreenCircle

```typescript
export type PcbSilkscreenCircleInput = z.input<typeof pcb_silkscreen_circle>
t

export type PcbSilkscreenCircleInput = z.input<typeof pcb_silkscreen_circle>
t
```

### PcbSilkscreenLine

```typescript
export type PcbSilkscreenLineInput = z.input<typeof pcb_silkscreen_line>
t

export type PcbSilkscreenLineInput = z.input<typeof pcb_silkscreen_line>
t
```

### PcbSilkscreenOval

```typescript
export type PcbSilkscreenOvalInput = z.input<typeof pcb_silkscreen_oval>
t

export type PcbSilkscreenOvalInput = z.input<typeof pcb_silkscreen_oval>
t
```

### PcbSilkscreenPath

```typescript
export type PcbSilkscreenPathInput = z.input<typeof pcb_silkscreen_path>
t

export type PcbSilkscreenPathInput = z.input<typeof pcb_silkscreen_path>
t
```

### PcbSilkscreenPill

```typescript
export type PcbSilkscreenPillInput = z.input<typeof pcb_silkscreen_pill>
t

export type PcbSilkscreenPillInput = z.input<typeof pcb_silkscreen_pill>
t
```

### PcbSilkscreenRect

```typescript
export type PcbSilkscreenRectInput = z.input<typeof pcb_silkscreen_rect>
t

export type PcbSilkscreenRectInput = z.input<typeof pcb_silkscreen_rect>
t
```

### PcbSilkscreenText

```typescript
export type PcbSilkscreenTextInput = z.input<typeof pcb_silkscreen_text>
t

export type PcbSilkscreenTextInput = z.input<typeof pcb_silkscreen_text>
t
```

### PcbSolderPaste

- Defines solderpaste on the PCB

```typescript
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}

export type PCBSolderPasteInput = z.input<typeof pcb_solder_paste>
t

/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}

/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteRect {
  type: "pcb_solder_paste"
  shape: "rect"
  pcb_solder_paste_id: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}
```

### PcbText

```typescript
export type PcbTextInput = z.input<typeof pcb_text>
t

export type PcbTextInput = z.input<typeof pcb_text>
t
```

### PcbTrace

```typescript
export type PcbTraceInput = z.input<typeof pcb_trace>
t

export type PcbTraceInput = z.input<typeof pcb_trace>
t

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

export type PcbTraceRoutePoint = PcbTraceRoutePointWire | PcbTraceRoutePointVia

/**
 * @deprecated use PcbTraceInput
 */
export type PCBTraceInput = PcbTraceInput
```

### PcbTraceError

```typescript
export type PcbTraceErrorInput = z.input<typeof pcb_trace_error>
t

export type PcbTraceErrorInput = z.input<typeof pcb_trace_error>
t
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

export type PcbTraceHintInput = z.input<typeof pcb_trace_hint>
t
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

export type SchematicBoxInput = z.input<typeof schematic_box>
t
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

export type SchematicPortArrangement =


export type SchematicComponentInput = z.input<typeof schematic_component>
t
```

### SchematicDebugObject

```typescript
export type SchematicDebugObject =


export interface SchematicDebugRect {
  type: "schematic_debug_object"
  label?: string
  shape: "rect"
  center: Point
  size: Size
}

export interface SchematicDebugLine {
  type: "schematic_debug_object"
  label?: string
  shape: "line"
  start: Point
  end: Point
}

export interface SchematicDebugPoint {
  type: "schematic_debug_object"
  label?: string
  shape: "point"
  center: Point
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

export type SchematicErrorInput = z.input<typeof schematic_error>
t
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

export type SchematicLineInput = z.input<typeof schematic_line>
t
```

### SchematicNetLabel

```typescript
export type SchematicNetLabelInput = z.input<typeof schematic_net_label>
e

export type SchematicNetLabelInput = z.input<typeof schematic_net_label>
e
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

export type SchematicPathInput = z.input<typeof schematic_path>
t
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

export type SchematicPortInput = z.input<typeof schematic_port>
t
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

export type SchematicTextInput = z.input<typeof schematic_text>
t
```

### SchematicTrace

```typescript
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

export type SchematicTraceInput = z.input<typeof schematic_trace>
t
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

export type SchematicVoltageProbeInput = z.input<typeof schematic_voltage_probe>
t
```

<!-- circuit-json-docs:end -->
