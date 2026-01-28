import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_panelization_placement_error = z
  .object({
    type: z.literal("pcb_panelization_placement_error"),
    pcb_panelization_placement_error_id: getZodPrefixedIdWithDefault(
      "pcb_panelization_placement_error",
    ),
    error_type: z
      .literal("pcb_panelization_placement_error")
      .default("pcb_panelization_placement_error"),
    message: z.string(),
    pcb_panel_id: z.string().optional(),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a panelization placement error on the PCB")

export type PcbPanelizationPlacementErrorInput = z.input<
  typeof pcb_panelization_placement_error
>
type InferredPcbPanelizationPlacementError = z.infer<
  typeof pcb_panelization_placement_error
>

/**
 * Defines a panelization placement error on the PCB
 */
export interface PcbPanelizationPlacementError {
  type: "pcb_panelization_placement_error"
  pcb_panelization_placement_error_id: string
  error_type: "pcb_panelization_placement_error"
  message: string
  pcb_panel_id?: string
  pcb_board_id?: string
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPanelizationPlacementError
 */
export type PCBPanelizationPlacementError = PcbPanelizationPlacementError

expectTypesMatch<
  PcbPanelizationPlacementError,
  InferredPcbPanelizationPlacementError
>(true)
