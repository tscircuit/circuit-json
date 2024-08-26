import { z } from "zod"
import { length } from "../units"
import { point } from "../common"

export const pcb_board = z
  .object({
    type: z.literal("pcb_board"),
    pcb_board_id: z.string().default("pcb_board_0"),
    width: length,
    height: length,
    center: point,
    outline: z.array(point).optional(),
  })
  .describe("Defines the board outline of the PCB")

export type PCBBoardInput = z.input<typeof pcb_board>
export type PCBBoard = z.infer<typeof pcb_board>
