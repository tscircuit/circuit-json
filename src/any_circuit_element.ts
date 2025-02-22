import { z } from "zod"
import * as pcb from "./pcb"
import * as sch from "./schematic"
import * as src from "./source"
import * as cad from "./cad"

export const any_circuit_element = z.union([
  // TODO source_config
  // TODO pcb_config
  // TODO schematic_config
  // TODO schematic_group
  src.source_trace,
  src.source_port,
  src.any_source_component,
  src.source_led,
  src.source_net,
  src.source_group,
  src.source_simple_bug,
  src.source_simple_chip,
  src.source_simple_capacitor,
  src.source_simple_diode,
  src.source_simple_resistor,
  src.source_simple_power_source,
  src.source_simple_battery,
  src.source_simple_inductor,
  src.source_simple_pin_header,
  src.source_simple_resonator,
  src.source_simple_switch,
  src.source_simple_transistor,
  src.source_simple_mosfet,
  src.source_simple_potentiometer,
  src.source_simple_push_button,
  pcb.pcb_component,
  pcb.pcb_hole,
  pcb.pcb_missing_footprint_error,
  pcb.pcb_manual_edit_conflict_error,
  pcb.pcb_plated_hole,
  pcb.pcb_keepout,
  pcb.pcb_port,
  pcb.pcb_text,
  pcb.pcb_trace,
  pcb.pcb_via,
  pcb.pcb_smtpad,
  pcb.pcb_solder_paste,
  pcb.pcb_board,
  pcb.pcb_group,
  pcb.pcb_trace_hint,
  pcb.pcb_silkscreen_line,
  pcb.pcb_silkscreen_path,
  pcb.pcb_silkscreen_text,
  pcb.pcb_silkscreen_rect,
  pcb.pcb_silkscreen_circle,
  pcb.pcb_silkscreen_oval,
  pcb.pcb_trace_error,
  pcb.pcb_placement_error,
  pcb.pcb_port_not_matched_error,
  pcb.pcb_fabrication_note_path,
  pcb.pcb_fabrication_note_text,
  pcb.pcb_autorouting_error,
  sch.schematic_box,
  sch.schematic_text,
  sch.schematic_line,
  sch.schematic_component,
  sch.schematic_port,
  sch.schematic_trace,
  sch.schematic_path,
  sch.schematic_error,
  sch.schematic_net_label,
  sch.schematic_debug_object,
  sch.schematic_voltage_probe,
  cad.cad_component,
])

/**
 * @deprecated use any_circuit_element instead
 */
export const any_soup_element = any_circuit_element

export type AnyCircuitElement = z.infer<typeof any_circuit_element>
export type AnyCircuitElementInput = z.input<typeof any_circuit_element>
/**
 * @deprecated use AnyCircuitElement instead
 */
export type AnySoupElement = AnyCircuitElement

/**
 * @deprecated use AnyCircuitElementInput instead
 */
export type AnySoupElementInput = AnyCircuitElementInput

/**
 * Type representing a complete Circuit JSON document, which is an array of circuit elements.
 * This is the primary type used when working with circuit-json files or API responses.
 */
export type CircuitJson = AnyCircuitElement[]
