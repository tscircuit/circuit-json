import { z } from "zod"
import * as pcb from "./pcb"
import * as sch from "./schematic"
import * as src from "./source"
import * as cad from "./cad"
import * as sim from "./simulation"
import {
  expectStringUnionsMatch,
  expectTypesMatch,
} from "./utils/expect-types-match"

export const any_circuit_element = z.union([
  // TODO source_config
  // TODO pcb_config
  // TODO schematic_config
  // TODO schematic_group
  src.source_trace,
  src.source_port,
  src.any_source_component,
  src.source_net,
  src.source_group,
  src.source_simple_chip,
  src.source_simple_capacitor,
  src.source_simple_diode,
  src.source_simple_led,
  src.source_simple_resistor,
  src.source_simple_power_source,
  src.source_simple_battery,
  src.source_simple_inductor,
  src.source_simple_pin_header,
  src.source_simple_pinout,
  src.source_simple_resonator,
  src.source_simple_switch,
  src.source_simple_transistor,
  src.source_simple_test_point,
  src.source_simple_mosfet,
  src.source_simple_potentiometer,
  src.source_simple_push_button,
  src.source_pcb_ground_plane,
  src.source_manually_placed_via,
  src.source_board,
  src.source_project_metadata,
  src.source_trace_not_connected_error,
  src.source_pin_missing_trace_warning,
  src.unknown_error_finding_part,
  pcb.pcb_component,
  pcb.pcb_hole,
  pcb.pcb_missing_footprint_error,
  pcb.external_footprint_load_error,
  pcb.circuit_json_footprint_load_error,
  pcb.pcb_manual_edit_conflict_warning,
  pcb.pcb_plated_hole,
  pcb.pcb_keepout,
  pcb.pcb_port,
  pcb.pcb_net,
  pcb.pcb_text,
  pcb.pcb_trace,
  pcb.pcb_via,
  pcb.pcb_smtpad,
  pcb.pcb_solder_paste,
  pcb.pcb_board,
  pcb.pcb_panel,
  pcb.pcb_group,
  pcb.pcb_trace_hint,
  pcb.pcb_silkscreen_line,
  pcb.pcb_silkscreen_path,
  pcb.pcb_silkscreen_text,
  pcb.pcb_copper_text,
  pcb.pcb_silkscreen_rect,
  pcb.pcb_silkscreen_circle,
  pcb.pcb_silkscreen_oval,
  pcb.pcb_trace_error,
  pcb.pcb_trace_missing_error,
  pcb.pcb_placement_error,
  pcb.pcb_port_not_matched_error,
  pcb.pcb_port_not_connected_error,
  pcb.pcb_via_clearance_error,
  pcb.pcb_fabrication_note_path,
  pcb.pcb_fabrication_note_text,
  pcb.pcb_fabrication_note_rect,
  pcb.pcb_fabrication_note_dimension,
  pcb.pcb_note_text,
  pcb.pcb_note_rect,
  pcb.pcb_note_path,
  pcb.pcb_note_line,
  pcb.pcb_note_dimension,
  pcb.pcb_autorouting_error,
  pcb.pcb_footprint_overlap_error,
  pcb.pcb_breakout_point,
  pcb.pcb_cutout,
  pcb.pcb_ground_plane,
  pcb.pcb_ground_plane_region,
  pcb.pcb_thermal_spoke,
  pcb.pcb_copper_pour,
  pcb.pcb_component_outside_board_error,
  pcb.pcb_component_invalid_layer_error,
  pcb.pcb_courtyard_rect,
  pcb.pcb_courtyard_outline,
  pcb.pcb_courtyard_polygon,
  sch.schematic_box,
  sch.schematic_text,
  sch.schematic_line,
  sch.schematic_rect,
  sch.schematic_circle,
  sch.schematic_arc,
  sch.schematic_component,
  sch.schematic_port,
  sch.schematic_trace,
  sch.schematic_path,
  sch.schematic_error,
  sch.schematic_layout_error,
  sch.schematic_net_label,
  sch.schematic_debug_object,
  sch.schematic_voltage_probe,
  sch.schematic_manual_edit_conflict_warning,
  sch.schematic_group,
  sch.schematic_table,
  sch.schematic_table_cell,
  cad.cad_component,
  sim.simulation_voltage_source,
  sim.simulation_experiment,
  sim.simulation_transient_voltage_graph,
  sim.simulation_switch,
  sim.simulation_voltage_probe,
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

// ------------------- SAFETY CHECKS -------------------

// SAFETY CHECK: Every element has a type
expectTypesMatch<
  AnyCircuitElement extends { type: string } ? AnyCircuitElement : never,
  AnyCircuitElement
>(true)

// SAFETY CHECK: Every element has an id with the key name `${type}_id`
type FindMissingId<T extends AnyCircuitElement> = T extends {
  type: infer U extends string
}
  ? T extends { [K in `${U}_id`]: infer V }
    ? V extends string
      ? never
      : `${U} DOES NOT HAVE AN ${U}_id PROPERTY`
    : `${U} DOES NOT HAVE AN ${U}_id PROPERTY`
  : never

expectStringUnionsMatch<
  FindMissingId<AnyCircuitElement>,
  // EXCEPTIONS TO THE RULE
  // THIS IS FOR LEGACY REASONS, DO NOT ADD MORE EXCEPTIONS
  | "source_project_metadata DOES NOT HAVE AN source_project_metadata_id PROPERTY"
  | "pcb_port_not_matched_error DOES NOT HAVE AN pcb_port_not_matched_error_id PROPERTY"
  | "pcb_autorouting_error DOES NOT HAVE AN pcb_autorouting_error_id PROPERTY"
  | "pcb_footprint_overlap_error DOES NOT HAVE AN pcb_footprint_overlap_error_id PROPERTY"
  | "pcb_via_clearance_error DOES NOT HAVE AN pcb_via_clearance_error_id PROPERTY"
  | "schematic_debug_object DOES NOT HAVE AN schematic_debug_object_id PROPERTY"
  | "schematic_box DOES NOT HAVE AN schematic_box_id PROPERTY"
  | "schematic_path DOES NOT HAVE AN schematic_path_id PROPERTY"
>(true)
