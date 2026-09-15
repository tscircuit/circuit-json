import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_fabricator_extra_charge_warning = z
  .object({
    type: z.literal("pcb_fabricator_extra_charge_warning"),
    pcb_fabricator_extra_charge_warning_id: getZodPrefixedIdWithDefault(
      "pcb_fabricator_extra_charge_warning",
    ),
    warning_type: z
      .literal("pcb_fabricator_extra_charge_warning")
      .default("pcb_fabricator_extra_charge_warning"),
    message: z.string(),
    fabricator_preset: z.string(),
    pcb_board_id: z.string().optional(),
    pcb_via_ids: z.array(z.string()).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning that a design feature incurs an extra charge for the selected fabricator preset, such as via hole diameters below 0.3 mm with JLCPCB economy or standard presets.",
  )

export type PcbFabricatorExtraChargeWarningInput = z.input<
  typeof pcb_fabricator_extra_charge_warning
>
type InferredPcbFabricatorExtraChargeWarning = z.infer<
  typeof pcb_fabricator_extra_charge_warning
>

/**
 * Warning that a design feature incurs an extra charge for the selected
 * fabricator preset. For JLCPCB economy or standard presets (including dated
 * variants), via hole diameters below 0.3 mm are an intended use case.
 * The producer detects the condition; this record describes the warning.
 */
export interface PcbFabricatorExtraChargeWarning {
  type: "pcb_fabricator_extra_charge_warning"
  pcb_fabricator_extra_charge_warning_id: string
  warning_type: "pcb_fabricator_extra_charge_warning"
  message: string
  /** Selected preset, for example jlcpcb_economy or jlcpcb_standard_20260912. */
  fabricator_preset: string
  pcb_board_id?: string
  /** Vias responsible for the extra charge, when the warning concerns vias. */
  pcb_via_ids?: string[]
  subcircuit_id?: string
}

expectTypesMatch<
  PcbFabricatorExtraChargeWarning,
  InferredPcbFabricatorExtraChargeWarning
>(true)
