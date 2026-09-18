import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_keepout_overlap_warning = z
  .object({
    type: z.literal("pcb_keepout_overlap_warning"),
    pcb_keepout_overlap_warning_id: getZodPrefixedIdWithDefault(
      "pcb_keepout_overlap_warning",
    ),
    warning_type: z
      .literal("pcb_keepout_overlap_warning")
      .default("pcb_keepout_overlap_warning"),
    message: z.string(),
    pcb_keepout_id: z.string(),
    pcb_component_ids: z.array(z.string()).optional(),
    pcb_trace_ids: z.array(z.string()).optional(),
    pcb_smtpad_ids: z.array(z.string()).optional(),
    pcb_plated_hole_ids: z.array(z.string()).optional(),
    pcb_via_ids: z.array(z.string()).optional(),
    center: point.optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when copper overlaps a PCB keepout with warning_only enabled",
  )

export type PcbKeepoutOverlapWarningInput = z.input<
  typeof pcb_keepout_overlap_warning
>
type InferredPcbKeepoutOverlapWarning = z.infer<
  typeof pcb_keepout_overlap_warning
>

/** Warning emitted when copper overlaps a PCB keepout with warning_only enabled. */
export interface PcbKeepoutOverlapWarning {
  type: "pcb_keepout_overlap_warning"
  pcb_keepout_overlap_warning_id: string
  warning_type: "pcb_keepout_overlap_warning"
  message: string
  /** The advisory keepout that was overlapped. */
  pcb_keepout_id: string
  /** IDs of the components and copper primitives involved in the overlap. */
  pcb_component_ids?: string[]
  pcb_trace_ids?: string[]
  pcb_smtpad_ids?: string[]
  pcb_plated_hole_ids?: string[]
  pcb_via_ids?: string[]
  /** Optional overlap location in PCB coordinates, in millimeters. */
  center?: Point
  subcircuit_id?: string
}

expectTypesMatch<PcbKeepoutOverlapWarning, InferredPcbKeepoutOverlapWarning>(
  true,
)
