import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_group = z
  .object({
    type: z.literal("pcb_group"),
    pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
    source_group_id: z.string(),
    is_subcircuit: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
    width: length.optional(),
    height: length.optional(),
    center: point,
    outline: z.array(point).optional(),
    anchor_position: point.optional(),
    anchor_alignment: z
      .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
      .optional(),
    pcb_component_ids: z.array(z.string()),
    child_layout_mode: z.enum(["packed", "none"]).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    layout_mode: z.string().optional(),
    autorouter_configuration: z
      .object({
        trace_clearance: length,
      })
      .optional(),
    autorouter_used_string: z.string().optional(),
  })
  .describe("Defines a group of components on the PCB")

export type PcbGroupInput = z.input<typeof pcb_group>
type InferredPcbGroup = z.infer<typeof pcb_group>

/**
 * Defines a group of components on the PCB
 */
export interface PcbGroup {
  type: "pcb_group"
  pcb_group_id: string
  source_group_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width?: Length
  height?: Length
  center: Point
  outline?: Point[]
  anchor_position?: Point
  anchor_alignment?:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  pcb_component_ids: string[]
  child_layout_mode?: "packed" | "none"
  name?: string
  description?: string
  layout_mode?: string
  autorouter_configuration?: {
    trace_clearance: Length
  }
  autorouter_used_string?: string
}

expectTypesMatch<PcbGroup, InferredPcbGroup>(true)
