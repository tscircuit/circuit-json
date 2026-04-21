import { z } from "zod"
import { length, type Length } from "src/units"

export const manufacturing_drc_properties = z.object({
  min_trace_width: length.optional(),
  min_board_edge_spacing: length.optional(),
  min_via_to_via_spacing: length.optional(),
  min_trace_to_pad_spacing: length.optional(),
  min_pad_to_pad_spacing: length.optional(),
  min_via_hole_diameter: length.optional(),
  min_via_pad_diameter: length.optional(),
})

export interface ManufacturingDrcProperties {
  min_trace_width?: Length
  min_board_edge_spacing?: Length
  min_via_to_via_spacing?: Length
  min_trace_to_pad_spacing?: Length
  min_pad_to_pad_spacing?: Length
  min_via_hole_diameter?: Length
  min_via_pad_diameter?: Length
}
