export * from "./properties/layer_ref"
export * from "./properties/pcb_route_hints"
export * from "./properties/supplier_name"
export * from "./properties/route_hint_point"

export * from "./pcb_component"
export * from "./pcb_hole"
export * from "./pcb_plated_hole"
export * from "./pcb_port"
export * from "./pcb_smtpad"
export * from "./pcb_solder_paste"
export * from "./pcb_text"
export * from "./pcb_trace"
export * from "./pcb_trace_error"
export * from "./pcb_port_not_matched_error"
export * from "./pcb_via"
export * from "./pcb_board"
export * from "./pcb_placement_error"
export * from "./pcb_trace_hint"
export * from "./pcb_silkscreen_line"
export * from "./pcb_silkscreen_path"
export * from "./pcb_silkscreen_text"
export * from "./pcb_silkscreen_rect"
export * from "./pcb_silkscreen_circle"
export * from "./pcb_silkscreen_oval"
export * from "./pcb_fabrication_note_text"
export * from "./pcb_fabrication_note_path"
export * from "./pcb_keepout"
export * from "./pcb_missing_footprint_error"
export * from "./pcb_manual_edit_conflict_error"
export * from "./pcb_group"
export * from "./pcb_autorouting_error"

import type { PcbComponent } from "./pcb_component"
import type { PcbHole } from "./pcb_hole"
import type { PcbPlatedHole } from "./pcb_plated_hole"
import type { PcbPort } from "./pcb_port"
import type { PcbSmtPad } from "./pcb_smtpad"
import type { PcbSolderPaste } from "./pcb_solder_paste"
import type { PcbText } from "./pcb_text"
import type { PcbTrace } from "./pcb_trace"
import type { PcbTraceError } from "./pcb_trace_error"
import type { PcbPortNotMatchedError } from "./pcb_port_not_matched_error"
import type { PcbVia } from "./pcb_via"
import type { PcbBoard } from "./pcb_board"
import type { PcbPlacementError } from "./pcb_placement_error"
import type { PcbMissingFootprintError } from "./pcb_missing_footprint_error"
import type { PcbManualEditConflictError } from "./pcb_manual_edit_conflict_error"
import type { PcbTraceHint } from "./pcb_trace_hint"
import type { PcbSilkscreenLine } from "./pcb_silkscreen_line"
import type { PcbSilkscreenPath } from "./pcb_silkscreen_path"
import type { PcbSilkscreenText } from "./pcb_silkscreen_text"
import type { PcbSilkscreenRect } from "./pcb_silkscreen_rect"
import type { PcbSilkscreenCircle } from "./pcb_silkscreen_circle"
import type { AutoroutingError } from "./pcb_autorouting_error"

export type PcbCircuitElement =
  | PcbComponent
  | PcbHole
  | PcbPlatedHole
  | PcbPort
  | PcbSmtPad
  | PcbSolderPaste
  | PcbText
  | PcbTrace
  | PcbTraceError
  | PcbMissingFootprintError
  | PcbManualEditConflictError
  | PcbPortNotMatchedError
  | PcbVia
  | PcbBoard
  | PcbPlacementError
  | PcbTraceHint
  | PcbSilkscreenLine
  | PcbSilkscreenPath
  | PcbSilkscreenText
  | PcbSilkscreenRect
  | PcbSilkscreenCircle
  | AutoroutingError
