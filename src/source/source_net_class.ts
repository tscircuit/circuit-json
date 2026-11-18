import { z } from "zod"

/** A named routing class. Distances are in millimeters. Unset widths inherit
 * from the next assigned class, then the board default. Membership is stored
 * on source_net in precedence order, so distinct classes may share a width. */
export const source_net_class = z.object({
  type: z.literal("source_net_class"),
  source_net_class_id: z.string(),
  name: z.string().min(1),
  trace_width: z.number().finite().positive().optional(),
  priority: z.number().int().nonnegative().optional(),
  subcircuit_id: z.string().optional(),
})

export type SourceNetClass = z.infer<typeof source_net_class>
export type SourceNetClassInput = z.input<typeof source_net_class>
