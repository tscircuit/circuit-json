import { z } from "zod"

export const pcb_trace_error = z
  .object({
    pcb_error_id: z.string(),
    type: z.literal("pcb_error"),
    error_type: z.literal("pcb_trace_error"),
    message: z.string(),
    pcb_trace_id: z.string(),
    source_trace_id: z.string(),
    pcb_component_ids: z.array(z.string()),
    pcb_port_ids: z.array(z.string()),
  })
  .describe("Defines a trace error on the PCB")

export type PCBTraceErrorInput = z.input<typeof pcb_trace_error>
export type PCBTraceError = z.infer<typeof pcb_trace_error>
