import { z } from "zod"
import { length } from "../units"
import { point } from "../common"

export const pcb_board = z
  .object({
    type: z.literal("pcb_board"),
    width: length,
    height: length,
    center: point,
  })
  .describe("Defines the board outline of the PCB")

export type PCBBoardInput = z.input<typeof pcb_board>
export type PCBBoard = z.infer<typeof pcb_board>
