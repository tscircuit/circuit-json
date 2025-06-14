import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_net = z.object({
  type: z.literal("source_net"),
  source_net_id: z.string(),
  name: z.string(),
  member_source_group_ids: z.array(z.string()),
  is_power: z.boolean().optional(),
  is_ground: z.boolean().optional(),
  is_digital_signal: z.boolean().optional(),
  is_analog_signal: z.boolean().optional(),
  trace_width: z.number().optional(),
  subcircuit_id: z.string().optional(),
  subcircuit_connectivity_map_key: z.string().optional(),
})

export type SourceNetInput = z.input<typeof source_net>
type InferredSourceNet = z.infer<typeof source_net>

export interface SourceNet extends SourceNetInput {
  type: "source_net"
  source_net_id: string
  name: string
  member_source_group_ids: string[]
  is_power?: boolean
  is_ground?: boolean
  is_digital_signal?: boolean
  is_analog_signal?: boolean
  trace_width?: number
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
}

expectTypesMatch<SourceNet, InferredSourceNet>(true)
