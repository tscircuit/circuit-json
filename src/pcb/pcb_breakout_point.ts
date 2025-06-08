import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_breakout_point = z
  .object({
    type: z.literal("pcb_breakout_point"),
    pcb_breakout_point_id: getZodPrefixedIdWithDefault("pcb_breakout_point"),
    pcb_group_id: z.string(),
    subcircuit_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    source_net_id: z.string().optional(),
    x: distance,
    y: distance,
  })
  .describe(
    "Defines a routing target within a pcb_group for a source_trace or source_net",
  )

export type PcbBreakoutPointInput = z.input<typeof pcb_breakout_point>
type InferredPcbBreakoutPoint = z.infer<typeof pcb_breakout_point>

/**
 * Defines a routing target within a pcb_group for a source_trace or source_net
 */
export interface PcbBreakoutPoint {
  type: "pcb_breakout_point"
  pcb_breakout_point_id: string
  pcb_group_id: string
  subcircuit_id?: string
  source_trace_id?: string
  source_net_id?: string
  x: Distance
  y: Distance
}

expectTypesMatch<PcbBreakoutPoint, InferredPcbBreakoutPoint>(true)
