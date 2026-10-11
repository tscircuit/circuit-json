import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { pcb_trace_warning, type PcbTraceWarning } from "./pcb_trace_warning"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A constrained connection can have no trace record, for example a plane return. */
export const pcb_trace_length_warning = pcb_trace_warning
  .omit({ type: true, pcb_trace_warning_id: true, warning_type: true })
  .extend({
    type: z.literal("pcb_trace_length_warning"),
    pcb_trace_length_warning_id: getZodPrefixedIdWithDefault(
      "pcb_trace_length_warning",
    ),
    warning_type: z
      .literal("pcb_trace_length_warning")
      .default("pcb_trace_length_warning"),
    pcb_trace_id: z.string().optional(),
    trace_length_status: z.literal("indeterminate"),
    maximum_trace_length: z.number(),
    measurement_reason: z.string(),
  })
  .describe(
    "A trace length constraint whose physical path cannot be determined",
  )

export type PcbTraceLengthWarningInput = z.input<
  typeof pcb_trace_length_warning
>

export interface PcbTraceLengthWarning
  extends Omit<
    PcbTraceWarning,
    "type" | "pcb_trace_warning_id" | "warning_type" | "pcb_trace_id"
  > {
  type: "pcb_trace_length_warning"
  pcb_trace_length_warning_id: string
  warning_type: "pcb_trace_length_warning"
  pcb_trace_id?: string
  trace_length_status: "indeterminate"
  maximum_trace_length: number
  measurement_reason: string
}

expectTypesMatch<
  PcbTraceLengthWarning,
  z.infer<typeof pcb_trace_length_warning>
>(true)
