import type {
  PcbCircuitElement,
  PCBKeepout,
  PcbGroup,
  PcbSilkscreenOval,
  PcbFabricationNotePath,
  PcbFabricationNoteText,
} from "./pcb"
import type {
  SchematicBox,
  SchematicComponent,
  SchematicError,
  SchematicLine,
  SchematicPath,
  SchematicPort,
  SchematicText,
  SchematicTrace,
  SchematicVoltageProbe,
  SchematicNetLabel,
  SchematicDebugObject,
} from "./schematic"
import type {
  AnySourceComponent,
  SourcePort,
  SourceTrace,
  SourceNet,
  SourceGroup,
  SourceProjectMetadata,
} from "./source"
import type { CadComponent } from "./cad"

export type CircuitElement =
  | PcbCircuitElement
  | PCBKeepout
  | PcbGroup
  | PcbSilkscreenOval
  | PcbFabricationNotePath
  | PcbFabricationNoteText
  | SchematicBox
  | SchematicComponent
  | SchematicError
  | SchematicLine
  | SchematicPath
  | SchematicPort
  | SchematicText
  | SchematicTrace
  | SchematicVoltageProbe
  | SchematicNetLabel
  | SchematicDebugObject
  | AnySourceComponent
  | SourcePort
  | SourceTrace
  | SourceNet
  | SourceGroup
  | SourceProjectMetadata
  | CadComponent

const IdMap = {
  // Source elements
  source_component: "source_component_id",
  source_port: "source_port_id",
  source_trace: "source_trace_id",
  source_net: "source_net_id",
  source_group: "source_group_id",
  source_project_metadata: "type",

  // PCB elements
  pcb_component: "pcb_component_id",
  pcb_hole: "pcb_hole_id",
  pcb_plated_hole: "pcb_plated_hole_id",
  pcb_port: "pcb_port_id",
  pcb_smtpad: "pcb_smtpad_id",
  pcb_solder_paste: "pcb_solder_paste_id",
  pcb_text: "pcb_text_id",
  pcb_trace: "pcb_trace_id",
  pcb_via: "pcb_via_id",
  pcb_board: "pcb_board_id",
  pcb_group: "pcb_group_id",
  pcb_trace_hint: "pcb_trace_hint_id",
  pcb_silkscreen_line: "pcb_silkscreen_line_id",
  pcb_silkscreen_path: "pcb_silkscreen_path_id",
  pcb_silkscreen_text: "pcb_silkscreen_text_id",
  pcb_silkscreen_rect: "pcb_silkscreen_rect_id",
  pcb_silkscreen_circle: "pcb_silkscreen_circle_id",
  pcb_silkscreen_oval: "pcb_silkscreen_oval_id",
  pcb_fabrication_note_path: "pcb_fabrication_note_path_id",
  pcb_fabrication_note_text: "pcb_fabrication_note_text_id",
  pcb_trace_error: "pcb_trace_error_id",
  pcb_placement_error: "pcb_error_id",
  pcb_missing_footprint_error: "pcb_missing_footprint_error_id",
  pcb_manual_edit_conflict_error: "pcb_error_id",
  pcb_port_not_matched_error: "pcb_error_id",
  pcb_autorouting_error: "pcb_error_id",
  pcb_keepout: "pcb_keepout_id",

  // Schematic elements
  schematic_box: "schematic_component_id",
  schematic_text: "schematic_text_id",
  schematic_line: "schematic_component_id",
  schematic_component: "schematic_component_id",
  schematic_port: "schematic_port_id",
  schematic_trace: "schematic_trace_id",
  schematic_path: "schematic_component_id",
  schematic_error: "schematic_error_id",
  schematic_net_label: "source_net_id",
  schematic_debug_object: "type",
  schematic_voltage_probe: "schematic_voltage_probe_id",

  // CAD elements
  cad_component: "cad_component_id",
} as const

type IdMapType = typeof IdMap

/**
 * Returns the primary ID for any circuit element.
 * This function is type-safe and will cause a TypeScript error if a new element type is added without handling its ID.
 */
export function getPrimaryId<T extends CircuitElement>(element: T): string {
  const idField = IdMap[element.type as keyof IdMapType]
  if (!idField) {
    throw new Error(`Unhandled element type: ${element.type}`)
  }
  return element[idField as keyof T] as string
}
