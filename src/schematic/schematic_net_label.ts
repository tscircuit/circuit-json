import { z } from "zod"
import { point, type Point } from "../common/point"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { getZodPrefixedIdWithDefault } from "src/common"

export interface SchematicNetLabel {
  type: "schematic_net_label"
  schematic_net_label_id: string
  schematic_trace_id?: string
  source_trace_id?: string
  source_net_id: string
  center: Point
  anchor_position?: Point | undefined
  anchor_side: "top" | "bottom" | "left" | "right"
  text: string
  symbol_name?: string | undefined
  /**
   * When true the net label can be repositioned. When false the label's
   * position is fixed by the element it is attached to.
   */
  is_movable?: boolean
  subcircuit_id?: string
}

export const schematic_net_label = z.object({
  type: z.literal("schematic_net_label"),
  schematic_net_label_id: getZodPrefixedIdWithDefault("schematic_net_label"),
  schematic_trace_id: z.string().optional(),
  source_trace_id: z.string().optional(),
  source_net_id: z.string(),
  center: point,
  anchor_position: point.optional(),
  anchor_side: z.enum(["top", "bottom", "left", "right"]),
  text: z.string(),
  symbol_name: z.string().optional(),
  is_movable: z.boolean().optional(),
  subcircuit_id: z.string().optional(),
})

export type SchematicNetLabelInput = z.input<typeof schematic_net_label>
export type InferredSchematicNetLabel = z.infer<typeof schematic_net_label>

expectTypesMatch<SchematicNetLabel, InferredSchematicNetLabel>(true)
