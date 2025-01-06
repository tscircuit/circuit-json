import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_board = z
  .object({
    type: z.literal("pcb_board"),
    pcb_board_id: getZodPrefixedIdWithDefault("pcb_board"),
    width: length,
    height: length,
    center: point,
    thickness: length.optional().default(1.4),
    num_layers: z.number().optional().default(4),
    outline: z.array(point).optional(),
    outline_offset_x: length,
    outline_offset_y: length,
  })
  .describe("Defines the board outline of the PCB")

/**
 * Defines the board outline of the PCB
 */
export interface PcbBoard {
  type: "pcb_board"
  pcb_board_id: string
  width: Length
  height: Length
  thickness: Length
  num_layers: number
  center: Point
  outline?: Point[]
  outline_offset_x: Length
  outline_offset_y: Length
}

export type PcbBoardInput = z.input<typeof pcb_board>
type InferredPcbBoard = z.infer<typeof pcb_board>

/**
 * @deprecated use PcbBoard
 */
export type PCBBoard = PcbBoard

expectTypesMatch<PcbBoard, InferredPcbBoard>(true)
