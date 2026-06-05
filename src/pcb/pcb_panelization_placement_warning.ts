import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_panelization_placement_warning = z
  .object({
    type: z.literal("pcb_panelization_placement_warning"),
    pcb_panelization_placement_warning_id: getZodPrefixedIdWithDefault(
      "pcb_panelization_placement_warning",
    ),
    warning_type: z
      .literal("pcb_panelization_placement_warning")
      .default("pcb_panelization_placement_warning"),
    message: z.string(),
    pcb_panel_id: z.string().optional(),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a panelization placement warning on the PCB")

export type PcbPanelizationPlacementWarningInput = z.input<
  typeof pcb_panelization_placement_warning
>
type InferredPcbPanelizationPlacementWarning = z.infer<
  typeof pcb_panelization_placement_warning
>

/**
 * Defines a panelization placement warning on the PCB
 */
export interface PcbPanelizationPlacementWarning {
  type: "pcb_panelization_placement_warning"
  pcb_panelization_placement_warning_id: string
  warning_type: "pcb_panelization_placement_warning"
  message: string
  pcb_panel_id?: string
  pcb_board_id?: string
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPanelizationPlacementWarning
 */
export type PCBPanelizationPlacementWarning = PcbPanelizationPlacementWarning

expectTypesMatch<
  PcbPanelizationPlacementWarning,
  InferredPcbPanelizationPlacementWarning
>(true)
