import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component_outside_board_error = z
  .object({
    type: z.literal("pcb_component_outside_board_error"),
    pcb_component_outside_board_error_id: getZodPrefixedIdWithDefault(
      "pcb_component_outside_board_error",
    ),
    error_type: z
      .literal("pcb_component_outside_board_error")
      .default("pcb_component_outside_board_error"),
    message: z.string(),
    pcb_component_id: z.string(),
    pcb_board_id: z.string(),
    component_center: point,
    component_bounds: z.object({
      min_x: z.number(),
      max_x: z.number(),
      min_y: z.number(),
      max_y: z.number(),
    }),
    subcircuit_id: z.string().optional(),
    source_component_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a PCB component is placed outside the board boundaries",
  )

export type PcbComponentOutsideBoardErrorInput = z.input<
  typeof pcb_component_outside_board_error
>
type InferredPcbComponentOutsideBoardError = z.infer<
  typeof pcb_component_outside_board_error
>

/** Error emitted when a PCB component is placed outside the board boundaries */
export interface PcbComponentOutsideBoardError {
  type: "pcb_component_outside_board_error"
  pcb_component_outside_board_error_id: string
  error_type: "pcb_component_outside_board_error"
  message: string
  pcb_component_id: string
  pcb_board_id: string
  component_center: Point
  component_bounds: {
    min_x: number
    max_x: number
    min_y: number
    max_y: number
  }
  subcircuit_id?: string
  source_component_id?: string
}

expectTypesMatch<
  PcbComponentOutsideBoardError,
  InferredPcbComponentOutsideBoardError
>(true)
