import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component_not_on_board_edge_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_component_not_on_board_edge_error"),
    pcb_component_not_on_board_edge_error_id: getZodPrefixedIdWithDefault(
      "pcb_component_not_on_board_edge_error",
    ),
    error_type: z
      .literal("pcb_component_not_on_board_edge_error")
      .default("pcb_component_not_on_board_edge_error"),
    pcb_component_id: z.string(),
    pcb_board_id: z.string(),
    component_center: point,
    pad_to_nearest_board_edge_distance: z.number(),
    source_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a component that must be placed on the board edge is centered away from the edge",
  )

export type PcbComponentNotOnBoardEdgeErrorInput = z.input<
  typeof pcb_component_not_on_board_edge_error
>
type InferredPcbComponentNotOnBoardEdgeError = z.infer<
  typeof pcb_component_not_on_board_edge_error
>

/** Error emitted when a component that must be placed on the board edge is centered away from the edge */
export interface PcbComponentNotOnBoardEdgeError extends BaseCircuitJsonError {
  type: "pcb_component_not_on_board_edge_error"
  pcb_component_not_on_board_edge_error_id: string
  error_type: "pcb_component_not_on_board_edge_error"
  pcb_component_id: string
  pcb_board_id: string
  component_center: Point
  pad_to_nearest_board_edge_distance: number
  source_component_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  PcbComponentNotOnBoardEdgeError,
  InferredPcbComponentNotOnBoardEdgeError
>(true)
