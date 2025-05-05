# Circuit JSON Specification: Source Component Overview

> Created at 2025-01-22T00:01:36.571Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SOURCE_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `SourceComponent` has a `source_component.parse` function that you
can also import.

```ts
interface SourceComponentBase {
  type: "source_component"
  ftype?: string
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}

interface SourceSimpleTransistor extends SourceComponentBase {
  ftype: "simple_transistor"
  transistor_type: "npn" | "pnp"
}

interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
}

interface SourceSimpleCrystal extends SourceComponentBase {
  ftype: "simple_crystal"
  frequency: number
  load_capacitance?: number
}

interface SourceSimpleInductor extends SourceComponentBase {
  ftype: "simple_inductor"
  inductance: number
}

interface SourceLed extends SourceComponentBase {
  ftype: "led"
}

interface SourceSimplePotentiometer extends SourceComponentBase {
  ftype: "simple_potentiometer"
  max_resistance: number
}

interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_connectivity_map_key?: string
  max_length?: number
  display_name?: string
}

interface SourceSimpleGround extends SourceComponentBase {
  ftype: "simple_ground"
}

interface SourceSimpleResistor extends SourceComponentBase {
  ftype: "simple_resistor"
  resistance: number
  display_resistance?: string
}

interface SourceSimpleResonator extends SourceComponentBase {
  ftype: "simple_resonator"
  load_capacitance: number
  equivalent_series_resistance?: number
  frequency: number
}

interface SourceSimpleBattery extends SourceComponentBase {
  ftype: "simple_battery"
  capacity: number
}

interface SourceNet {
  type: "source_net"
  source_net_id: string
  name: string
  member_source_group_ids: string[]
  is_power?: boolean
  is_ground?: boolean
  is_digital_signal?: boolean
  is_analog_signal?: boolean
  trace_width?: number
}

interface SourceSimplePushButton extends SourceComponentBase {
  ftype: "simple_push_button"
}

interface SourceSimpleMosfet extends SourceComponentBase {
  ftype: "simple_mosfet"
  channel_type: "n" | "p"
  mosfet_mode: "enhancement" | "depletion"
}

interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
}

interface SourceGroup {
  type: "source_group"
  source_group_id: string
  subcircuit_id?: string
  is_subcircuit?: boolean
  name?: string
}

interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id: string
}

interface SourceSimplePowerSource extends SourceComponentBase {
  ftype: "simple_power_source"
  voltage: number
}

interface SourceSimplePinHeader extends SourceComponentBase {
  ftype: "simple_pin_header"
  pin_count: number
  gender?: "male" | "female"
}

interface SourceSimpleCapacitor extends SourceComponentBase {
  ftype: "simple_capacitor"
  capacitance: number
  display_capacitance?: string
  max_decoupling_trace_length?: number
}

```