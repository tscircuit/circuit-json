import { z } from "zod"

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
})

export type SourceNet = z.infer<typeof source_net>
export type SourceNetInput = z.input<typeof source_net>
