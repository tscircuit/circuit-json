import { z } from "zod"
import { point } from "../common/point"

export const schematic_net_label = z.object({
  type: z.literal("schematic_net_label"),
  source_net_id: z.string(),
  center: point,
  anchor_position: point.optional(),
  anchor_side: z.enum(["top", "bottom", "left", "right"]),
  text: z.string(),
  symbol_name: z.string().optional(),
  connecting_segment_route: z.array(point).optional(),
})

export type SchematicNetLabelInput = z.input<typeof schematic_net_label>
export type SchematicNetLabel = z.infer<typeof schematic_net_label>
