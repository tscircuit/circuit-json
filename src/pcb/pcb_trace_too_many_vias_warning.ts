import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_too_many_vias_warning = z
  .object({
    type: z.literal("pcb_trace_too_many_vias_warning"),
    pcb_trace_too_many_vias_warning_id: getZodPrefixedIdWithDefault(
      "pcb_trace_too_many_vias_warning",
    ),
    warning_type: z
      .literal("pcb_trace_too_many_vias_warning")
      .default("pcb_trace_too_many_vias_warning"),
    message: z.string(),
    pcb_trace_id: z.string(),
    source_net_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    actual_via_count: z.number().int().nonnegative(),
    maximum_via_count: z.number().int().nonnegative(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a PCB trace has more vias than its maximum allowed count",
  )

export type PcbTraceTooManyViasWarningInput = z.input<
  typeof pcb_trace_too_many_vias_warning
>
type InferredPcbTraceTooManyViasWarning = z.infer<
  typeof pcb_trace_too_many_vias_warning
>

/** Warning emitted when a PCB trace has more vias than its maximum allowed count */
export interface PcbTraceTooManyViasWarning {
  type: "pcb_trace_too_many_vias_warning"
  pcb_trace_too_many_vias_warning_id: string
  warning_type: "pcb_trace_too_many_vias_warning"
  message: string
  pcb_trace_id: string
  source_net_id?: string
  source_trace_id?: string
  actual_via_count: number
  maximum_via_count: number
  subcircuit_id?: string
}

expectTypesMatch<
  PcbTraceTooManyViasWarning,
  InferredPcbTraceTooManyViasWarning
>(true)
