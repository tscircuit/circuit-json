# Circuit JSON Specification `circuit-json`

Circuit JSON a low-level JSON-array circuit representation. It contains all the information needed to visually represent a schematic, PCB, produce Gerber files, produce bill of materials, run SPICE simulations, view warnings and more. It is designed to easily interoperate with a SQL database.

[tscircuit](https://github.com/tscircuit/tscircuit) · [discord](https://tscircuit.com/join) · [online circuit json viewer](https://circuitjson.com/) · [example.json](https://github.com/tscircuit/circuitjson.com/blob/main/assets/usb-c-flashlight.json) · [Introduction to Circuit JSON Video](https://www.youtube.com/watch?v=QMWobH5tmqo)

[![npm version](https://badge.fury.io/js/circuit-json.svg)](https://badge.fury.io/js/circuit-json)

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

https://github.com/user-attachments/assets/2f28b7ba-689e-4d80-85b2-5bdef84b41f8

> To quickly generate Circuit JSON with tscircuit, use [tscircuit/eval](https://github.com/tscircuit/eval)

## Things You Can Do With Circuit JSON

- Generate [Gerber files](https://github.com/tscircuit/circuit-json-to-gerber)
- Generate and read [Specctra DSN Autorouting files](https://github.com/tscircuit/dsn-converter)
- Generate [Pick'n'Place Files](https://github.com/tscircuit/circuit-json-to-pnp-csv)
- Generate [PCB and Schematic SVGs](https://github.com/tscircuit/circuit-to-svg)
- Generate [Bill of Materials](https://github.com/tscircuit/circuit-json-to-bom-csv)
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
    - [SourceBoard](#sourceboard)
    - [SourceComponentBase](#sourcecomponentbase)
    - [SourceFailedToCreateComponentError](#sourcefailedtocreatecomponenterror)
    - [SourceGroup](#sourcegroup)
    - [SourceManuallyPlacedVia](#sourcemanuallyplacedvia)
    - [SourceMissingPropertyError](#sourcemissingpropertyerror)
    - [SourceNet](#sourcenet)
    - [SourcePcbGroundPlane](#sourcepcbgroundplane)
    - [SourcePinMissingTraceWarning](#sourcepinmissingtracewarning)
    - [SourcePort](#sourceport)
    - [SourceProjectMetadata](#sourceprojectmetadata)
    - [SourcePropertyIgnoredWarning](#sourcepropertyignoredwarning)
    - [SourceSimpleBattery](#sourcesimplebattery)
    - [SourceSimpleCapacitor](#sourcesimplecapacitor)
    - [SourceSimpleChip](#sourcesimplechip)
    - [SourceSimpleCrystal](#sourcesimplecrystal)
    - [SourceSimpleDiode](#sourcesimplediode)
    - [SourceSimpleFuse](#sourcesimplefuse)
    - [SourceSimpleGround](#sourcesimpleground)
    - [SourceSimpleInductor](#sourcesimpleinductor)
    - [SourceSimpleLed](#sourcesimpleled)
    - [SourceSimpleMosfet](#sourcesimplemosfet)
    - [SourceSimplePinHeader](#sourcesimplepinheader)
    - [SourceSimplePinout](#sourcesimplepinout)
    - [SourceSimplePotentiometer](#sourcesimplepotentiometer)
    - [SourceSimplePowerSource](#sourcesimplepowersource)
    - [SourceSimplePushButton](#sourcesimplepushbutton)
    - [SourceSimpleResistor](#sourcesimpleresistor)
    - [SourceSimpleResonator](#sourcesimpleresonator)
    - [SourceSimpleSwitch](#sourcesimpleswitch)
    - [SourceSimpleTestPoint](#sourcesimpletestpoint)
    - [SourceSimpleTransistor](#sourcesimpletransistor)
    - [SourceTrace](#sourcetrace)
    - [SourceTraceNotConnectedError](#sourcetracenotconnectederror)
  - [CAD Components](#cad-components)
    - [CadComponent](#cadcomponent)
  - [PCB Elements](#pcb-elements)
    - [PcbAutoroutingError](#pcbautoroutingerror)
    - [PcbBoard](#pcbboard)
    - [PcbBreakoutPoint](#pcbbreakoutpoint)
    - [PcbComponent](#pcbcomponent)
    - [PcbComponentOutsideBoardError](#pcbcomponentoutsideboarderror)
    - [PcbCopperPour](#pcbcopperpour)
    - [PcbCourtyardOutline](#pcbcourtyardoutline)
    - [PcbCourtyardRect](#pcbcourtyardrect)
    - [PcbCutout](#pcbcutout)
    - [PcbFabricationNoteDimension](#pcbfabricationnotedimension)
    - [PcbFabricationNotePath](#pcbfabricationnotepath)
    - [PcbFabricationNoteRect](#pcbfabricationnoterect)
    - [PcbFabricationNoteText](#pcbfabricationnotetext)
    - [PcbFootprintOverlapError](#pcbfootprintoverlaperror)
    - [PcbGroundPlane](#pcbgroundplane)
    - [PcbGroundPlaneRegion](#pcbgroundplaneregion)
    - [PcbGroup](#pcbgroup)
    - [PcbHole](#pcbhole)
    - [PcbManualEditConflictWarning](#pcbmanualeditconflictwarning)
    - [PcbMissingFootprintError](#pcbmissingfootprinterror)
    - [PcbNet](#pcbnet)
    - [PcbNoteDimension](#pcbnotedimension)
    - [PcbNoteLine](#pcbnoteline)
    - [PcbNotePath](#pcbnotepath)
    - [PcbNoteRect](#pcbnoterect)
    - [PcbNoteText](#pcbnotetext)
    - [PcbPlacementError](#pcbplacementerror)
    - [PcbPlatedHole](#pcbplatedhole)
    - [PcbPort](#pcbport)
    - [PcbPortNotConnectedError](#pcbportnotconnectederror)
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
    - [PcbThermalSpoke](#pcbthermalspoke)
    - [PcbTrace](#pcbtrace)
    - [PcbTraceError](#pcbtraceerror)
    - [PcbTraceHint](#pcbtracehint)
    - [PcbTraceMissingError](#pcbtracemissingerror)
    - [PcbVia](#pcbvia)
    - [PcbViaClearanceError](#pcbviaclearanceerror)
  - [Schematic Elements](#schematic-elements)
    - [SchematicArc](#schematicarc)
    - [SchematicBox](#schematicbox)
    - [SchematicCircle](#schematiccircle)
    - [SchematicComponent](#schematiccomponent)
    - [SchematicDebugObject](#schematicdebugobject)
    - [SchematicError](#schematicerror)
    - [SchematicGroup](#schematicgroup)
    - [SchematicLayoutError](#schematiclayouterror)
    - [SchematicLine](#schematicline)
    - [SchematicManualEditConflictWarning](#schematicmanualeditconflictwarning)
    - [SchematicNetLabel](#schematicnetlabel)
    - [SchematicPath](#schematicpath)
    - [SchematicPort](#schematicport)
    - [SchematicRect](#schematicrect)
    - [SchematicTable](#schematictable)
    - [SchematicTableCell](#schematictablecell)
    - [SchematicText](#schematictext)
    - [SchematicTrace](#schematictrace)
    - [SchematicVoltageProbe](#schematicvoltageprobe)
  - [Simulation Elements](#simulation-elements)
    - [SimulationExperiment](#simulationexperiment)
    - [SimulationSwitch](#simulationswitch)
    - [SimulationTransientVoltageGraph](#simulationtransientvoltagegraph)
    - [SimulationVoltageProbe](#simulationvoltageprobe)
    - [SimulationVoltageSource](#simulationvoltagesource)

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

| Measurement Type | Base Unit | Description        |
| ---------------- | --------- | ------------------ |
| Length           | mm        | Millimeters        |
| Duration         | ms        | Milliseconds       |
| Timestamp        | string    | ISO 8601 Timestamp |
| Mass             | g         | Grams              |
| Angle            | deg       | Degrees            |
| Frequency        | Hz        | Hertz              |
| Volume           | ml        | Milliliters        |
| Voltage          | V         | Volts              |
| Current          | A         | Amperes            |
| Resistance       | Ω         | Ohms               |
| Capacitance      | F         | Farads             |
| Inductance       | H         | Henries            |

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

### SourceBoard

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_board.ts)

Defines a board in the source domain

```typescript
/** Defines a board in the source domain */
interface SourceBoard {
  type: "source_board"
  source_board_id: string
  source_group_id: string
  title?: string
}
```

### SourceComponentBase

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/base/source_component_base.ts)

```typescript
interface SourceComponentBase {
  type: "source_component"
  ftype?: string
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<SupplierName, string[]>>
  display_value?: string
  are_pins_interchangeable?: boolean
  internally_connected_source_port_ids?: string[][]
  source_group_id?: string
  subcircuit_id?: string
}
```

### SourceFailedToCreateComponentError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_failed_to_create_component_error.ts)

```typescript
/** Error emitted when a component fails to be constructed.
 * Contains details about the failure and prevents the component from being rendered. */
interface SourceFailedToCreateComponentError {
  type: "source_failed_to_create_component_error"
  source_failed_to_create_component_error_id: string
  error_type: "source_failed_to_create_component_error"
  message: string
  component_name?: string
  subcircuit_id?: string
  parent_source_component_id?: string
  pcb_center?: {
    x?: number
    y?: number
  }
  schematic_center?: {
    x?: number
    y?: number
  }
}
```

### SourceGroup

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_group.ts)

```typescript
interface SourceGroup {
  type: "source_group"
  source_group_id: string
  subcircuit_id?: string
  parent_subcircuit_id?: string
  parent_source_group_id?: string
  is_subcircuit?: boolean
  show_as_schematic_box?: boolean
  name?: string
  was_automatically_named?: boolean
}
```

### SourceManuallyPlacedVia

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_manually_placed_via.ts)

Defines a via that is manually placed in the source domain

```typescript
/** Defines a via that is manually placed in the source domain */
interface SourceManuallyPlacedVia {
  type: "source_manually_placed_via"
  source_manually_placed_via_id: string
  source_group_id: string
  source_net_id: string
  subcircuit_id?: string
  source_trace_id?: string
}
```

### SourceMissingPropertyError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_missing_property_error.ts)

The source code is missing a property

```typescript
/** The source code is missing a property */
interface SourceMissingPropertyError {
  type: "source_missing_property_error"
  source_missing_property_error_id: string
  source_component_id: string
  property_name: string
  subcircuit_id?: string
  error_type: "source_missing_property_error"
  message: string
}
```

### SourceNet

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_net.ts)

```typescript
interface SourceNet {
  type: "source_net"
  source_net_id: string
  name: string
  member_source_group_ids: string[]
  is_power?: boolean
  is_ground?: boolean
  is_digital_signal?: boolean
  is_analog_signal?: boolean
  is_positive_voltage_source?: boolean
  trace_width?: number
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
}
```

### SourcePcbGroundPlane

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_pcb_ground_plane.ts)

Defines a ground plane in the source domain

```typescript
/** Defines a ground plane in the source domain */
interface SourcePcbGroundPlane {
  type: "source_pcb_ground_plane"
  source_pcb_ground_plane_id: string
  source_group_id: string
  source_net_id: string
  subcircuit_id?: string
}
```

### SourcePinMissingTraceWarning

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_pin_missing_trace_warning.ts)

Warning emitted when a source component pin is missing a trace connection

```typescript
/** Warning emitted when a source component pin is missing a trace connection */
interface SourcePinMissingTraceWarning {
  type: "source_pin_missing_trace_warning"
  source_pin_missing_trace_warning_id: string
  warning_type: "source_pin_missing_trace_warning"
  message: string
  source_component_id: string
  source_port_id: string
  subcircuit_id?: string
}
```

### SourcePort

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_port.ts)

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
  subcircuit_connectivity_map_key?: string
}
```

### SourceProjectMetadata

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_project_metadata.ts)

```typescript
interface SourceProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  project_url?: string
  created_at?: string // ISO8601 timestamp
}
```

### SourcePropertyIgnoredWarning

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_property_ignored_warning.ts)

The source property was ignored

```typescript
/** The source property was ignored */
interface SourcePropertyIgnoredWarning {
  type: "source_property_ignored_warning"
  source_property_ignored_warning_id: string
  source_component_id: string
  property_name: string
  subcircuit_id?: string
  error_type: "source_property_ignored_warning"
  message: string
}
```

### SourceSimpleBattery

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_battery.ts)

Defines a simple battery component

```typescript
/** Defines a simple battery component */
interface SourceSimpleBattery extends SourceComponentBase {
  ftype: "simple_battery"
  capacity: number
}
```

### SourceSimpleCapacitor

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_capacitor.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_chip.ts)

Defines a simple integrated circuit component

```typescript
/** Defines a simple integrated circuit component */
interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
}
```

### SourceSimpleCrystal

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_crystal.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_diode.ts)

Defines a simple diode component

```typescript
/** Defines a simple diode component */
interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
}
```

### SourceSimpleFuse

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_fuse.ts)

```typescript
interface SourceSimpleFuse extends SourceComponentBase {
  ftype: "simple_fuse"
  current_rating_amps: number
  voltage_rating_volts: number
}
```

### SourceSimpleGround

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_ground.ts)

Defines a simple ground component

```typescript
/** Defines a simple ground component */
interface SourceSimpleGround extends SourceComponentBase {
  ftype: "simple_ground"
}
```

### SourceSimpleInductor

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_inductor.ts)

Defines a simple inductor component

```typescript
/** Defines a simple inductor component */
interface SourceSimpleInductor extends SourceComponentBase {
  ftype: "simple_inductor"
  inductance: number
  max_current_rating?: number
}
```

### SourceSimpleLed

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_led.ts)

Defines a simple led component

```typescript
/** Defines a simple led component */
interface SourceSimpleLed extends Omit<SourceSimpleDiode, "ftype"> {
  ftype: "simple_led"
  color?: string
  wavelength?: string
}
```

### SourceSimpleMosfet

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_mosfet.ts)

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

### SourceSimplePinHeader

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_pin_header.ts)

```typescript
interface SourceSimplePinHeader extends SourceComponentBase {
  ftype: "simple_pin_header"
  pin_count: number
  gender: "male" | "female"
}
```

### SourceSimplePinout

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_pinout.ts)

Defines a simple pinout component

```typescript
/** Defines a simple pinout component */
interface SourceSimplePinout extends SourceComponentBase {
  ftype: "simple_pinout"
}
```

### SourceSimplePotentiometer

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_potentiometer.ts)

```typescript
interface SourceSimplePotentiometer extends SourceComponentBase {
  ftype: "simple_potentiometer"
  max_resistance: number
}
```

### SourceSimplePowerSource

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_power_source.ts)

Defines a simple power source component

```typescript
/** Defines a simple power source component */
interface SourceSimplePowerSource extends SourceComponentBase {
  ftype: "simple_power_source"
  voltage: number
}
```

### SourceSimplePushButton

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_push_button.ts)

Defines a simple push button component

```typescript
/** Defines a simple push button component */
interface SourceSimplePushButton extends SourceComponentBase {
  ftype: "simple_push_button"
}
```

### SourceSimpleResistor

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_resistor.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_resonator.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_switch.ts)

Defines a simple switch component

```typescript
/** Defines a simple switch component */
interface SourceSimpleSwitch extends SourceComponentBase {
  ftype: "simple_switch"
}
```

### SourceSimpleTestPoint

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_test_point.ts)

```typescript
/** Defines a simple test point component
 * Can be surface-mount or through-hole.
 * Pad shape and dimensions configurable for different use cases. */
interface SourceSimpleTestPoint extends SourceComponentBase {
  ftype: "simple_test_point"
  footprint_variant?: "pad" | "through_hole"
  pad_shape?: "rect" | "circle"
  pad_diameter?: number | string
  hole_diameter?: number | string
  width?: number | string
  height?: number | string
}
```

### SourceSimpleTransistor

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_simple_transistor.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_trace.ts)

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
  min_trace_thickness?: number
}
```

### SourceTraceNotConnectedError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/source/source_trace_not_connected_error.ts)

Occurs when a source trace selector does not match any ports

```typescript
/** Occurs when a source trace selector does not match any ports */
interface SourceTraceNotConnectedError {
  type: "source_trace_not_connected_error"
  source_trace_not_connected_error_id: string
  error_type: "source_trace_not_connected_error"
  message: string
  subcircuit_id?: string
  source_group_id?: string
  source_trace_id?: string
  connected_source_port_ids?: string[]
  selectors_not_found?: string[]
}
```

## CAD Components

### CadComponent

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/cad/cad_component.ts)

```typescript
interface CadComponent {
  type: "cad_component"
  cad_component_id: string
  pcb_component_id: string
  source_component_id: string
  position: Point3
  rotation?: Point3
  size?: Point3
  layer?: LayerRef
  subcircuit_id?: string
  footprinter_string?: string
  model_obj_url?: string
  model_stl_url?: string
  model_3mf_url?: string
  model_gltf_url?: string
  model_glb_url?: string
  model_step_url?: string
  model_wrl_url?: string
  model_unit_to_mm_scale_factor?: number
  model_jscad?: any
}
```

## PCB Elements

### PcbAutoroutingError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_autorouting_error.ts)

```typescript
interface PcbAutoroutingErrorInterface {
  type: "pcb_autorouting_error"
  pcb_error_id: string
  error_type: "pcb_autorouting_error"
  message: string
  subcircuit_id?: string
}
```

### PcbBoard

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_board.ts)

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
  material: "fr4" | "fr1"
}
```

### PcbBreakoutPoint

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_breakout_point.ts)

Defines a routing target within a pcb_group for a source_trace or source_net

```typescript
/** Defines a routing target within a pcb_group for a source_trace or source_net */
interface PcbBreakoutPoint {
  type: "pcb_breakout_point"
  pcb_breakout_point_id: string
  pcb_group_id: string
  subcircuit_id?: string
  source_trace_id?: string
  source_port_id?: string
  source_net_id?: string
  x: Distance
  y: Distance
}
```

### PcbComponent

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_component.ts)

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
  do_not_place?: boolean
  pcb_group_id?: string
  obstructs_within_bounds: boolean
}
```

### PcbComponentOutsideBoardError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_component_outside_board_error.ts)

Error emitted when a PCB component is placed outside the board boundaries

```typescript
/** Error emitted when a PCB component is placed outside the board boundaries */
interface PcbComponentOutsideBoardError {
  type: "pcb_component_outside_board_error"
  pcb_component_outside_board_error_id: string
  error_type: "pcb_component_outside_board_error"
  message: string
  pcb_component_id: string
  pcb_board_id: string
  component_center: Point
  component_bounds: {
    min_x: number
    max_x: number
    min_y: number
    max_y: number
  }
  subcircuit_id?: string
  source_component_id?: string
}
```

### PcbCopperPour

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_copper_pour.ts)

Defines a rectangular copper pour on the PCB.

```typescript
/** Defines a rectangular copper pour on the PCB. */
interface PcbCopperPourRect {
  type: "pcb_copper_pour"
  pcb_copper_pour_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  source_net_id?: string
  shape: "rect"
  center: Point
  width: Length
  height: Length
  rotation?: Rotation
}
```

### PcbCourtyardOutline

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_courtyard_outline.ts)

Defines a courtyard outline on the PCB

```typescript
/** Defines a courtyard outline on the PCB */
interface PcbCourtyardOutline {
  type: "pcb_courtyard_outline"
  pcb_courtyard_outline_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  outline: Point[]
  stroke_width: Length
  is_closed?: boolean
  is_stroke_dashed?: boolean
  color?: string
}
```

### PcbCourtyardRect

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_courtyard_rect.ts)

Defines a courtyard rectangle on the PCB

```typescript
/** Defines a courtyard rectangle on the PCB */
interface PcbCourtyardRect {
  type: "pcb_courtyard_rect"
  pcb_courtyard_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: VisibleLayer
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}
```

### PcbCutout

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_cutout.ts)

Defines a rectangular cutout on the PCB.

```typescript
/** Defines a rectangular cutout on the PCB. */
interface PcbCutoutRect {
  type: "pcb_cutout"
  pcb_cutout_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  shape: "rect"
  center: Point
  width: Length
  height: Length
  rotation?: Rotation
}
```

### PcbFabricationNoteDimension

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_fabrication_note_dimension.ts)

Defines a measurement annotation within PCB fabrication notes

```typescript
/** Defines a measurement annotation within PCB fabrication notes */
interface PcbFabricationNoteDimension {
  type: "pcb_fabrication_note_dimension"
  pcb_fabrication_note_dimension_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  from: Point
  to: Point
  text?: string
  offset?: Length
  font: "tscircuit2024"
  font_size: Length
  color?: string
  arrow_size: Length
}
```

### PcbFabricationNotePath

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_fabrication_note_path.ts)

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

### PcbFabricationNoteRect

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_fabrication_note_rect.ts)

Defines a fabrication note rectangle on the PCB

```typescript
/** Defines a fabrication note rectangle on the PCB */
interface PcbFabricationNoteRect {
  type: "pcb_fabrication_note_rect"
  pcb_fabrication_note_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: VisibleLayer
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}
```

### PcbFabricationNoteText

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_fabrication_note_text.ts)

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

### PcbFootprintOverlapError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_footprint_overlap_error.ts)

Error emitted when a pcb footprint overlaps with another element

```typescript
/** Error emitted when a pcb footprint overlaps with another element */
interface PcbFootprintOverlapError {
  type: "pcb_footprint_overlap_error"
  pcb_error_id: string
  error_type: "pcb_footprint_overlap_error"
  message: string
  pcb_smtpad_ids?: string[]
  pcb_plated_hole_ids?: string[]
  pcb_hole_ids?: string[]
  pcb_keepout_ids?: string[]
}
```

### PcbGroundPlane

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_ground_plane.ts)

Defines a ground plane on the PCB

```typescript
/** Defines a ground plane on the PCB */
interface PcbGroundPlane {
  type: "pcb_ground_plane"
  pcb_ground_plane_id: string
  source_pcb_ground_plane_id: string
  source_net_id: string
  pcb_group_id?: string
  subcircuit_id?: string
}
```

### PcbGroundPlaneRegion

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_ground_plane_region.ts)

Defines a polygon region of a ground plane

```typescript
/** Defines a polygon region of a ground plane */
interface PcbGroundPlaneRegion {
  type: "pcb_ground_plane_region"
  pcb_ground_plane_region_id: string
  pcb_ground_plane_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  points: Point[]
}
```

### PcbGroup

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_group.ts)

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
  anchor_position?: Point
  anchor_alignment?:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  pcb_component_ids: string[]
  name?: string
  description?: string
  layout_mode?: string
  autorouter_configuration?: {
    trace_clearance: Length
  }
  autorouter_used_string?: string
}
```

### PcbHole

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_hole.ts)

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

### PcbManualEditConflictWarning

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_manual_edit_conflict_warning.ts)

Warning emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates

```typescript
/** Warning emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates */
interface PcbManualEditConflictWarning {
  type: "pcb_manual_edit_conflict_warning"
  pcb_manual_edit_conflict_warning_id: string
  warning_type: "pcb_manual_edit_conflict_warning"
  message: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}
```

### PcbMissingFootprintError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_missing_footprint_error.ts)

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

### PcbNet

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_net.ts)

Defines a net on the PCB

```typescript
/** Defines a net on the PCB */
interface PcbNet {
  type: "pcb_net"
  pcb_net_id: string
  source_net_id?: string
  highlight_color?: string
}
```

### PcbNoteDimension

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_note_dimension.ts)

Defines a measurement annotation within PCB documentation notes

```typescript
/** Defines a measurement annotation within PCB documentation notes */
interface PcbNoteDimension {
  type: "pcb_note_dimension"
  pcb_note_dimension_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  from: Point
  to: Point
  text?: string
  font: "tscircuit2024"
  font_size: Length
  color?: string
  arrow_size: Length
}
```

### PcbNoteLine

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_note_line.ts)

Defines a straight documentation note line on the PCB

```typescript
/** Defines a straight documentation note line on the PCB */
interface PcbNoteLine {
  type: "pcb_note_line"
  pcb_note_line_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  stroke_width: Distance
  color?: string
  is_dashed?: boolean
}
```

### PcbNotePath

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_note_path.ts)

Defines a polyline documentation note on the PCB

```typescript
/** Defines a polyline documentation note on the PCB */
interface PcbNotePath {
  type: "pcb_note_path"
  pcb_note_path_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  route: Point[]
  stroke_width: Length
  color?: string
}
```

### PcbNoteRect

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_note_rect.ts)

Defines a rectangular documentation note on the PCB

```typescript
/** Defines a rectangular documentation note on the PCB */
interface PcbNoteRect {
  type: "pcb_note_rect"
  pcb_note_rect_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}
```

### PcbNoteText

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_note_text.ts)

Defines a documentation note in text on the PCB

```typescript
/** Defines a documentation note in text on the PCB */
interface PcbNoteText {
  type: "pcb_note_text"
  pcb_note_text_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  font: "tscircuit2024"
  font_size: Length
  text: string
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

### PcbPlacementError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_placement_error.ts)

Defines a placement error on the PCB

```typescript
/** Defines a placement error on the PCB */
interface PcbPlacementError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  error_type: "pcb_placement_error"
  message: string
  subcircuit_id?: string
}
```

### PcbPlatedHole

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_plated_hole.ts)

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

interface PcbHolePillWithRectPad {
  type: "pcb_plated_hole"
  shape: "pill_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id: string
}

interface PcbHoleRotatedPillWithRectPad {
  type: "pcb_plated_hole"
  shape: "rotated_pill_hole_with_rect_pad"
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "rotated_pill"
  pad_shape: "rect"
  hole_width: number
  hole_height: number
  hole_ccw_rotation: Rotation
  rect_pad_width: number
  rect_pad_height: number
  rect_border_radius?: number
  rect_ccw_rotation: Rotation
  hole_offset_x: Distance
  hole_offset_y: Distance
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
  rect_border_radius?: number
  hole_offset_x: Distance
  hole_offset_y: Distance
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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_port.ts)

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
  is_board_pinout?: boolean
}
```

### PcbPortNotConnectedError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_port_not_connected_error.ts)

Defines an error when a pcb port is not connected to any trace

```typescript
/** Defines an error when a pcb port is not connected to any trace */
interface PcbPortNotConnectedError {
  type: "pcb_port_not_connected_error"
  pcb_port_not_connected_error_id: string
  error_type: "pcb_port_not_connected_error"
  message: string
  pcb_port_ids: string[]
  pcb_component_ids: string[]
  subcircuit_id?: string
}
```

### PcbPortNotMatchedError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_port_not_matched_error.ts)

Defines a trace error on the PCB where a port is not matched

```typescript
/** Defines a trace error on the PCB where a port is not matched */
interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  error_type: "pcb_port_not_matched_error"
  message: string
  pcb_component_ids: string[]
  subcircuit_id?: string
}
```

### PcbRouteHints

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/properties/pcb_route_hints.ts)

```typescript
type PcbRouteHints = PcbRouteHint[]

interface PcbRouteHint {
  x: number
  y: number
  via?: boolean
  via_to_layer?: LayerRef
}
```

### PcbSilkscreenCircle

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_circle.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_line.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_oval.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_path.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_pill.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_rect.ts)

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
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
}
```

### PcbSilkscreenText

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_silkscreen_text.ts)

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
  is_knockout?: boolean
  knockout_padding?: {
    left: Length
    top: Length
    bottom: Length
    right: Length
  }
  ccw_rotation?: number
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment: NinePointAnchor
}
```

### PcbSolderPaste

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_solder_paste.ts)

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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_text.ts)

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

### PcbThermalSpoke

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_thermal_spoke.ts)

Pattern for connecting a ground plane to a plated hole

```typescript
/** Pattern for connecting a ground plane to a plated hole */
interface PcbThermalSpoke {
  type: "pcb_thermal_spoke"
  pcb_thermal_spoke_id: string
  pcb_ground_plane_id: string
  shape: string
  spoke_count: number
  spoke_thickness: Distance
  spoke_inner_diameter: Distance
  spoke_outer_diameter: Distance
  pcb_plated_hole_id?: string
  subcircuit_id?: string
}
```

### PcbTrace

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_trace.ts)

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

type PcbTraceRoutePoint = PcbTraceRoutePointWire | PcbTraceRoutePointVia
```

### PcbTraceError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_trace_error.ts)

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
  subcircuit_id?: string
}
```

### PcbTraceHint

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_trace_hint.ts)

A hint that can be used during generation of a PCB trace.

```typescript
/** A hint that can be used during generation of a PCB trace. */
interface PcbTraceHint {
  type: "pcb_trace_hint"
  pcb_trace_hint_id: string
  pcb_port_id: string
  pcb_component_id: string
  route: RouteHintPoint[]
  subcircuit_id?: string
}
```

### PcbTraceMissingError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_trace_missing_error.ts)

Defines an error when a source trace has no corresponding PCB trace

```typescript
/** Defines an error when a source trace has no corresponding PCB trace */
interface PcbTraceMissingError {
  type: "pcb_trace_missing_error"
  pcb_trace_missing_error_id: string
  error_type: "pcb_trace_missing_error"
  message: string
  center?: Point
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
  subcircuit_id?: string
}
```

### PcbVia

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_via.ts)

Defines a via on the PCB

```typescript
/** Defines a via on the PCB */
interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  pcb_group_id?: string
  subcircuit_id?: string
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

### PcbViaClearanceError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/pcb/pcb_via_clearance_error.ts)

Error emitted when vias are closer than the allowed clearance

```typescript
/** Error emitted when vias are closer than the allowed clearance */
interface PcbViaClearanceError {
  type: "pcb_via_clearance_error"
  pcb_error_id: string
  error_type: "pcb_via_clearance_error"
  message: string
  pcb_via_ids: string[]
  minimum_clearance?: Distance
  actual_clearance?: Distance
  pcb_center?: {
    x?: number
    y?: number
  }
  subcircuit_id?: string
}
```

## Schematic Elements

### SchematicArc

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_arc.ts)

Draws a styled arc on the schematic

```typescript
/** Draws a styled arc on the schematic */
interface SchematicArc {
  type: "schematic_arc"
  schematic_arc_id: string
  schematic_component_id: string
  center: Point
  radius: number
  start_angle_degrees: number
  end_angle_degrees: number
  direction: "clockwise" | "counterclockwise"
  stroke_width?: number | null
  color: string
  is_dashed: boolean
  subcircuit_id?: string
}
```

### SchematicBox

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_box.ts)

```typescript
interface SchematicBox {
  type: "schematic_box"
  schematic_component_id?: string
  width: number
  height: number
  is_dashed: boolean
  x: number
  y: number
  subcircuit_id?: string
}
```

### SchematicCircle

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_circle.ts)

Draws a styled circle on the schematic

```typescript
/** Draws a styled circle on the schematic */
interface SchematicCircle {
  type: "schematic_circle"
  schematic_circle_id: string
  schematic_component_id: string
  center: Point
  radius: number
  stroke_width?: number | null
  color: string
  is_filled: boolean
  fill_color?: string
  is_dashed: boolean
  subcircuit_id?: string
}
```

### SchematicComponent

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_component.ts)

```typescript
interface SchematicComponent {
  type: "schematic_component"
  size: Size
  center: Point
  source_component_id?: string
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
  subcircuit_id?: string
  schematic_group_id?: string
  is_schematic_group?: boolean
  source_group_id?: string
  is_box_with_pins: boolean
}

interface SchematicPortArrangementBySize {
  left_size: number
  right_size: number
  top_size?: number
  bottom_size?: number
}

interface SchematicPortArrangementBySides {
  left_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  right_side?: { pins: number[]; direction?: "top-to-bottom" | "bottom-to-top" }
  top_side?: { pins: number[]; direction?: "left-to-right" | "right-to-left" }
  bottom_side?: {
    pins: number[]
    direction?: "left-to-right" | "right-to-left"
  }
}

type SchematicPortArrangement =
  | SchematicPortArrangementBySize
  | SchematicPortArrangementBySides
```

### SchematicDebugObject

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_debug_object.ts)

```typescript
type SchematicDebugObject =
  | SchematicDebugRect
  | SchematicDebugLine
  | SchematicDebugPoint

interface SchematicDebugRect {
  type: "schematic_debug_object"
  label?: string
  shape: "rect"
  center: Point
  size: Size
  subcircuit_id?: string
}

interface SchematicDebugLine {
  type: "schematic_debug_object"
  label?: string
  shape: "line"
  start: Point
  end: Point
  subcircuit_id?: string
}

interface SchematicDebugPoint {
  type: "schematic_debug_object"
  label?: string
  shape: "point"
  center: Point
  subcircuit_id?: string
}
```

### SchematicError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_error.ts)

```typescript
interface SchematicError {
  type: "schematic_error"
  schematic_error_id: string
  error_type: "schematic_port_not_found"
  message: string
  subcircuit_id?: string
}
```

### SchematicGroup

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_group.ts)

Defines a group of components on the schematic

```typescript
/** Defines a group of components on the schematic */
interface SchematicGroup {
  type: "schematic_group"
  schematic_group_id: string
  source_group_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  center: Point
  schematic_component_ids: string[]
  show_as_schematic_box?: boolean
  name?: string
  description?: string
}
```

### SchematicLayoutError

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_layout_error.ts)

```typescript
interface SchematicLayoutError {
  type: "schematic_layout_error"
  schematic_layout_error_id: string
  error_type: "schematic_layout_error"
  message: string
  source_group_id: string
  schematic_group_id: string
  subcircuit_id?: string
}
```

### SchematicLine

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_line.ts)

Draws a styled line on the schematic

```typescript
/** Draws a styled line on the schematic */
interface SchematicLine {
  type: "schematic_line"
  schematic_line_id: string
  schematic_component_id: string
  x1: number
  y1: number
  x2: number
  y2: number
  stroke_width?: number | null
  color: string
  is_dashed: boolean
  subcircuit_id?: string
}
```

### SchematicManualEditConflictWarning

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_manual_edit_conflict_warning.ts)

Warning emitted when a component has both manual placement (via manualEdits) and explicit schX/schY coordinates

```typescript
/** Warning emitted when a component has both manual placement (via manualEdits) and explicit schX/schY coordinates */
interface SchematicManualEditConflictWarning {
  type: "schematic_manual_edit_conflict_warning"
  schematic_manual_edit_conflict_warning_id: string
  warning_type: "schematic_manual_edit_conflict_warning"
  message: string
  schematic_component_id: string
  schematic_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}
```

### SchematicNetLabel

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_net_label.ts)

```typescript
interface SchematicNetLabel {
  type: "schematic_net_label"
  schematic_net_label_id: string
  schematic_trace_id?: string
  source_trace_id?: string
  source_net_id: string
  center: Point
  anchor_position?: Point | undefined
  anchor_side: "top" | "bottom" | "left" | "right"
  text: string
  symbol_name?: string | undefined
  /** When true the net label can be repositioned. When false the label's
   * position is fixed by the element it is attached to. */

  is_movable?: boolean
  subcircuit_id?: string
}
```

### SchematicPath

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_path.ts)

```typescript
interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
  subcircuit_id?: string
}
```

### SchematicPort

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_port.ts)

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
  subcircuit_id?: string
  is_connected?: boolean
  has_input_arrow?: boolean
  has_output_arrow?: boolean
}
```

### SchematicRect

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_rect.ts)

Draws a styled rectangle on the schematic

```typescript
/** Draws a styled rectangle on the schematic */
interface SchematicRect {
  type: "schematic_rect"
  schematic_rect_id: string
  schematic_component_id: string
  center: Point
  width: number
  height: number
  rotation: number
  stroke_width?: number | null
  color: string
  is_filled: boolean
  fill_color?: string
  is_dashed: boolean
  subcircuit_id?: string
}
```

### SchematicTable

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_table.ts)

Defines a table on the schematic, useful for displaying data in a structured format.

```typescript
/** Defines a table on the schematic, useful for displaying data in a structured format. */
interface SchematicTable {
  type: "schematic_table"
  schematic_table_id: string
  anchor_position: Point
  column_widths: Length[]
  row_heights: Length[]
  cell_padding?: Length
  border_width?: Length
  subcircuit_id?: string
  schematic_component_id?: string
  anchor?: NinePointAnchor
}
```

### SchematicTableCell

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_table_cell.ts)

Defines a cell within a schematic_table

```typescript
/** Defines a cell within a schematic_table */
interface SchematicTableCell {
  type: "schematic_table_cell"
  schematic_table_cell_id: string
  schematic_table_id: string
  start_row_index: number
  end_row_index: number
  start_column_index: number
  end_column_index: number
  text?: string
  center: Point
  width: Length
  height: Length
  horizontal_align?: "left" | "center" | "right"
  vertical_align?: "top" | "middle" | "bottom"
  font_size?: Length
  subcircuit_id?: string
}
```

### SchematicText

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_text.ts)

```typescript
interface SchematicText {
  type: "schematic_text"
  schematic_component_id?: string
  schematic_text_id: string
  text: string
  font_size: number
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor: NinePointAnchor | FivePointAnchor
  color: string
  subcircuit_id?: string
}
```

### SchematicTrace

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_trace.ts)

```typescript
interface SchematicTraceEdge {
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

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/schematic/schematic_voltage_probe.ts)

```typescript
interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
  voltage?: number
  subcircuit_id?: string
}
```

## Simulation Elements

### SimulationExperiment

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/simulation/simulation_experiment.ts)

```typescript
interface SimulationExperiment {
  type: "simulation_experiment"
  simulation_experiment_id: string
  name: string
  experiment_type: ExperimentType
  time_per_step?: number // ms
  start_time_ms?: number // ms
  end_time_ms?: number // ms
}
```

### SimulationSwitch

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/simulation/simulation_switch.ts)

```typescript
interface SimulationSwitch {
  type: "simulation_switch"
  simulation_switch_id: string
  closes_at?: number
  opens_at?: number
  starts_closed?: boolean
  switching_frequency?: number
}
```

### SimulationTransientVoltageGraph

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/simulation/simulation_transient_voltage_graph.ts)

```typescript
interface SimulationTransientVoltageGraph {
  type: "simulation_transient_voltage_graph"
  simulation_transient_voltage_graph_id: string
  simulation_experiment_id: string
  timestamps_ms?: number[]
  voltage_levels: number[]
  schematic_voltage_probe_id?: string
  simulation_voltage_probe_id?: string
  subcircuit_connectivity_map_key?: string
  time_per_step: number
  start_time_ms: number
  end_time_ms: number
  name?: string
}
```

### SimulationVoltageProbe

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/simulation/simulation_voltage_probe.ts)

Defines a voltage probe for simulation, connected to a port or a net.

```typescript
/** Defines a voltage probe for simulation, connected to a port or a net. */
interface SimulationVoltageProbe {
  type: "simulation_voltage_probe"
  simulation_voltage_probe_id: string
  source_port_id?: string
  source_net_id?: string
  name?: string
  subcircuit_id?: string
}
```

### SimulationVoltageSource

[Source](https://github.com/tscircuit/circuit-json/blob/main/src/simulation/simulation_voltage_source.ts)

```typescript
type SimulationVoltageSource =
  | SimulationDcVoltageSource
  | SimulationAcVoltageSource

/** Defines a DC voltage source for simulation purposes. It applies a voltage
 * difference between two source ports. */
interface SimulationDcVoltageSource {
  type: "simulation_voltage_source"
  simulation_voltage_source_id: string
  is_dc_source: true
  positive_source_port_id?: string
  positive_source_net_id?: string
  negative_source_port_id?: string
  negative_source_net_id?: string
  voltage: number
}

/** Defines an AC voltage source for simulation purposes. */
interface SimulationAcVoltageSource {
  type: "simulation_voltage_source"
  simulation_voltage_source_id: string
  is_dc_source: false
  terminal1_source_port_id?: string
  terminal2_source_port_id?: string
  terminal1_source_net_id?: string
  terminal2_source_net_id?: string
  voltage?: number
  frequency?: number
  peak_to_peak_voltage?: number
  wave_shape?: WaveShape
  phase?: number
  duty_cycle?: number
}
```

<!-- circuit-json-docs:end -->
