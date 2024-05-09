import { z } from "zod"
import { point } from "../common/point"

export const schematic_net_label = z.object({
  type: z.literal("schematic_net_label"),
  source_net_id: z.string(),
  center: point,
  text: z.string(),
})

export type SchematicNetLabelInput = z.input<typeof schematic_net_label>
export type SchematicNetLabel = z.infer<typeof schematic_net_label>
