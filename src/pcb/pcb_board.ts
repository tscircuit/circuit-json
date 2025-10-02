import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_board = z
  .object({
    type: z.literal("pcb_board"),
    pcb_board_id: getZodPrefixedIdWithDefault("pcb_board"),
    is_subcircuit: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
    width: length,
    height: length,
    center: point,
    thickness: length.optional().default(1.4),
    num_layers: z.number().optional().default(4),
    outline: z.array(point).optional(),
    material: z.enum(["fr4", "fr1"]).default("fr4"),
  })
  .describe("Defines the board outline of the PCB")

/**
 * Defines the board outline of the PCB
 */
export interface PcbBoard {
  type: "pcb_board"
  pcb_board_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  thickness: Length
  num_layers: number
  center: Point
  outline?: Point[]
  material: "fr4" | "fr1"
}

export type PcbBoardInput = z.input<typeof pcb_board>
type InferredPcbBoard = z.infer<typeof pcb_board>

/**
 * @deprecated use PcbBoard
 */
export type PCBBoard = PcbBoard

expectTypesMatch<PcbBoard, InferredPcbBoard>(true)
