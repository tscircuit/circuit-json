import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component_missing_courtyard_warning = z
  .object({
    type: z.literal("pcb_component_missing_courtyard_warning"),
    pcb_component_missing_courtyard_warning_id: getZodPrefixedIdWithDefault(
      "pcb_component_missing_courtyard_warning",
    ),
    warning_type: z
      .literal("pcb_component_missing_courtyard_warning")
      .default("pcb_component_missing_courtyard_warning"),
    message: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Warning emitted when a PCB component has no courtyard geometry")

export type PcbComponentMissingCourtyardWarningInput = z.input<
  typeof pcb_component_missing_courtyard_warning
>

type InferredPcbComponentMissingCourtyardWarning = z.infer<
  typeof pcb_component_missing_courtyard_warning
>

/** Warning emitted when a PCB component has no courtyard geometry */
export interface PcbComponentMissingCourtyardWarning {
  type: "pcb_component_missing_courtyard_warning"
  pcb_component_missing_courtyard_warning_id: string
  warning_type: "pcb_component_missing_courtyard_warning"
  message: string
  pcb_component_id: string
  source_component_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  PcbComponentMissingCourtyardWarning,
  InferredPcbComponentMissingCourtyardWarning
>(true)
