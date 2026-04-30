import { z } from "zod"
import { length, type Length } from "src/units"

export const manufacturing_drc_properties = z.object({
  min_trace_width: length.optional(),
  min_board_edge_clearance: length.optional(),
  min_via_hole_edge_to_via_hole_edge_clearance: length.optional(),
  min_plated_hole_drill_edge_to_drill_edge_clearance: length.optional(),
  min_trace_to_pad_edge_clearance: length.optional(),
  min_pad_edge_to_pad_edge_clearance: length.optional(),
  min_same_net_track_edge_to_track_edge_clearance: length.optional(),
  min_different_net_track_edge_to_track_edge_clearance: length.optional(),
  min_via_hole_diameter: length.optional(),
  min_via_pad_diameter: length.optional(),
})

export interface ManufacturingDrcProperties {
  min_trace_width?: Length
  min_board_edge_clearance?: Length
  min_via_hole_edge_to_via_hole_edge_clearance?: Length
  min_plated_hole_drill_edge_to_drill_edge_clearance?: Length
  min_trace_to_pad_edge_clearance?: Length
  min_pad_edge_to_pad_edge_clearance?: Length
  min_same_net_track_edge_to_track_edge_clearance?: Length
  min_different_net_track_edge_to_track_edge_clearance?: Length
  min_via_hole_diameter?: Length
  min_via_pad_diameter?: Length
}
