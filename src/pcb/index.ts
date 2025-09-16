export * from "./properties/brep"
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
export * from "./pcb_trace_missing_error"
export * from "./pcb_port_not_matched_error"
export * from "./pcb_port_not_connected_error"
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
export * from "./pcb_footprint_overlap_error"
export * from "./pcb_keepout"
export * from "./pcb_cutout"
export * from "./pcb_missing_footprint_error"
export * from "./external_footprint_load_error"
export * from "./json_footprint_load_error"
export * from "./pcb_group"
export * from "./pcb_autorouting_error"
export * from "./pcb_manual_edit_conflict_warning"
export * from "./pcb_breakout_point"
export * from "./pcb_ground_plane"
export * from "./pcb_ground_plane_region"
export * from "./pcb_thermal_spoke"
export * from "./pcb_copper_pour"
export * from "./pcb_component_outside_board_error"

import type { PcbComponent } from "./pcb_component"
import type { PcbHole } from "./pcb_hole"
import type { PcbPlatedHole } from "./pcb_plated_hole"
import type { PcbPort } from "./pcb_port"
import type { PcbSmtPad } from "./pcb_smtpad"
import type { PcbSolderPaste } from "./pcb_solder_paste"
import type { PcbText } from "./pcb_text"
import type { PcbTrace } from "./pcb_trace"
import type { PcbTraceError } from "./pcb_trace_error"
import type { PcbTraceMissingError } from "./pcb_trace_missing_error"
import type { PcbPortNotMatchedError } from "./pcb_port_not_matched_error"
import type { PcbPortNotConnectedError } from "./pcb_port_not_connected_error"
import type { PcbVia } from "./pcb_via"
import type { PcbBoard } from "./pcb_board"
import type { PcbPlacementError } from "./pcb_placement_error"
import type { PcbMissingFootprintError } from "./pcb_missing_footprint_error"
import type { ExternalFootprintLoadError } from "./external_footprint_load_error"
import type { PcbManualEditConflictWarning } from "./pcb_manual_edit_conflict_warning"
import type { PcbTraceHint } from "./pcb_trace_hint"
import type { PcbSilkscreenLine } from "./pcb_silkscreen_line"
import type { PcbSilkscreenPath } from "./pcb_silkscreen_path"
import type { PcbSilkscreenText } from "./pcb_silkscreen_text"
import type { PcbSilkscreenRect } from "./pcb_silkscreen_rect"
import type { PcbSilkscreenCircle } from "./pcb_silkscreen_circle"
import type { PcbAutoroutingError } from "./pcb_autorouting_error"
import type { PcbFootprintOverlapError } from "./pcb_footprint_overlap_error"
import type { PcbCutout } from "./pcb_cutout"
import type { PcbBreakoutPoint } from "./pcb_breakout_point"
import type { PcbGroundPlane } from "./pcb_ground_plane"
import type { PcbGroundPlaneRegion } from "./pcb_ground_plane_region"
import type { PcbThermalSpoke } from "./pcb_thermal_spoke"
import type { PcbCopperPour } from "./pcb_copper_pour"
import type { PcbComponentOutsideBoardError } from "./pcb_component_outside_board_error"
import type { JsonFootprintLoadError } from "./json_footprint_load_error"

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
  | PcbTraceMissingError
  | PcbMissingFootprintError
  | ExternalFootprintLoadError
  | JsonFootprintLoadError
  | PcbManualEditConflictWarning
  | PcbPortNotMatchedError
  | PcbPortNotConnectedError
  | PcbVia
  | PcbBoard
  | PcbPlacementError
  | PcbTraceHint
  | PcbSilkscreenLine
  | PcbSilkscreenPath
  | PcbSilkscreenText
  | PcbSilkscreenRect
  | PcbSilkscreenCircle
  | PcbAutoroutingError
  | PcbFootprintOverlapError
  | PcbCutout
  | PcbBreakoutPoint
  | PcbGroundPlane
  | PcbGroundPlaneRegion
  | PcbThermalSpoke
  | PcbCopperPour
  | PcbComponentOutsideBoardError
