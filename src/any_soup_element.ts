import { z } from "zod"
import * as pcb from "./pcb"
import * as sch from "./schematic"
import * as src from "./source"

export const any_soup_element = z.union([
  // TODO source_group
  // TODO source_config
  // TODO pcb_group
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
  src.source_simple_capacitor,
  src.source_simple_diode,
  src.source_simple_resistor,
  src.source_simple_power_source,
  pcb.pcb_component,
  pcb.pcb_hole,
  pcb.pcb_plated_hole,
  pcb.pcb_port,
  pcb.pcb_text,
  pcb.pcb_trace,
  pcb.pcb_via,
  pcb.pcb_smtpad,
  pcb.pcb_board,
  pcb.pcb_trace_hint,
  pcb.pcb_silkscreen_line,
  pcb.pcb_silkscreen_path,
  pcb.pcb_silkscreen_text,
  pcb.pcb_silkscreen_rect,
  pcb.pcb_silkscreen_circle,
  pcb.pcb_trace_error,
  pcb.pcb_placement_error,
  pcb.pcb_port_not_matched_error,
  pcb.pcb_fabrication_note_path,
  pcb.pcb_fabrication_note_text,
  sch.schematic_box,
  sch.schematic_text,
  sch.schematic_line,
  sch.schematic_component,
  sch.schematic_port,
  sch.schematic_trace,
  sch.schematic_path,
  sch.schematic_error,
  sch.schematic_net_label,
])

export type AnySoupElement = z.infer<typeof any_soup_element>
export type AnySoupElementInput = z.input<typeof any_soup_element>
