import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_fabrication_process_warning = z
  .object({
    type: z.literal("pcb_fabrication_process_warning"),
    pcb_fabrication_process_warning_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_process_warning",
    ),
    warning_type: z
      .literal("pcb_fabrication_process_warning")
      .default("pcb_fabrication_process_warning"),
    message: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string().optional(),
    pcb_board_id: z.string().optional(),
    land_pitch: z.number().positive(),
    required_process: z.string(),
    manufacturer: z.string(),
    reference_url: z.string().url().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a PCB component needs a fabrication process that generic geometry checks do not qualify",
  )

export type PcbFabricationProcessWarningInput = z.input<
  typeof pcb_fabrication_process_warning
>

type InferredPcbFabricationProcessWarning = z.infer<
  typeof pcb_fabrication_process_warning
>

/** Warning emitted when a component requires process-specific fabrication review */
export interface PcbFabricationProcessWarning {
  type: "pcb_fabrication_process_warning"
  pcb_fabrication_process_warning_id: string
  warning_type: "pcb_fabrication_process_warning"
  message: string
  pcb_component_id: string
  source_component_id?: string
  pcb_board_id?: string
  land_pitch: number
  required_process: string
  manufacturer: string
  reference_url?: string
  subcircuit_id?: string
}

expectTypesMatch<
  PcbFabricationProcessWarning,
  InferredPcbFabricationProcessWarning
>(true)
