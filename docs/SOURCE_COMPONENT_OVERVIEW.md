# Circuit JSON Specification: Source Component Overview

> Created at 2024-11-12T19:07:05.930Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SOURCE_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `SourceComponent` has a `source_component.parse` function that you
can also import.

```ts
interface SourceSimpleChip {
  type: "source_component"
  ftype: "simple_chip"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}

interface SourceSimpleInductor {
  type: "source_component"
  ftype: "simple_inductor"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
  inductance: number
  display_inductance?: string
  max_current_rating?: number
}

interface SourceLed {
  type: "source_component"
  ftype: "led"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}

interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_connectivity_map_key?: string
}

interface SourceSimpleGround {
  type: "source_component"
  ftype: "simple_ground"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}

interface SourceSimpleResistor {
  type: "source_component"
  ftype: "simple_resistor"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
  resistance: number
}

interface SourceSimpleBattery {
  type: "source_component"
  ftype: "simple_battery"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
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
  is_positive_voltage_source?: boolean
  trace_width?: number
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
}

interface SourceSimpleDiode {
  type: "source_component"
  ftype: "simple_diode"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}

interface SourceGroup {
  type: "source_group"
  source_group_id: string
  name?: string
  was_automatically_named?: boolean
}

interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id?: string
  source_group_id?: string
  most_frequently_referenced_by_name?: string
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  must_be_connected?: boolean
  provides_power?: boolean
  requires_power?: boolean
  provides_ground?: boolean
  requires_ground?: boolean
  provides_voltage?: string | number
  requires_voltage?: string | number
  do_not_connect?: boolean
  include_in_board_pinout?: boolean
  can_use_internal_pullup?: boolean
  is_using_internal_pullup?: boolean
  needs_external_pullup?: boolean
  can_use_internal_pulldown?: boolean
  is_using_internal_pulldown?: boolean
  needs_external_pulldown?: boolean
  can_use_open_drain?: boolean
  is_using_open_drain?: boolean
  can_use_push_pull?: boolean
  is_using_push_pull?: boolean
  should_have_decoupling_capacitor?: boolean
  recommended_decoupling_capacitor_capacitance?: string | number
  is_configured_for_i2c_sda?: boolean
  is_configured_for_i2c_scl?: boolean
  is_configured_for_spi_mosi?: boolean
  is_configured_for_spi_miso?: boolean
  is_configured_for_spi_sck?: boolean
  is_configured_for_spi_cs?: boolean
  is_configured_for_uart_tx?: boolean
  is_configured_for_uart_rx?: boolean
  supports_i2c_sda?: boolean
  supports_i2c_scl?: boolean
  supports_spi_mosi?: boolean
  supports_spi_miso?: boolean
  supports_spi_sck?: boolean
  supports_spi_cs?: boolean
  supports_uart_tx?: boolean
  supports_uart_rx?: boolean
}

interface SourceComponentInternalConnection {
  type: "source_component_internal_connection"
  source_component_internal_connection_id: string
  source_component_id: string
  source_port_ids: string[]
  subcircuit_id?: string
}

interface SourceSimplePowerSource {
  type: "source_component"
  ftype: "simple_power_source"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
  voltage: number
}

interface SourceSimpleCapacitor {
  type: "source_component"
  ftype: "simple_capacitor"
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
  capacitance: number
}

interface SourceComponentBase {
  type: "source_component"
  ftype?: string
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<string, string[]>>
  display_value?: string
}
```
