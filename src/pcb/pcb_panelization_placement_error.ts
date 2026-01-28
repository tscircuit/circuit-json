import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_panelization_placement_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_panelization_placement_error"),
    pcb_panelization_placement_error_id: getZodPrefixedIdWithDefault(
      "pcb_panelization_placement_error",
    ),
    error_type: z
      .literal("pcb_panelization_placement_error")
      .default("pcb_panelization_placement_error"),
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
export interface PcbPanelizationPlacementError extends BaseCircuitJsonError {
  type: "pcb_panelization_placement_error"
  pcb_panelization_placement_error_id: string
  error_type: "pcb_panelization_placement_error"
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
