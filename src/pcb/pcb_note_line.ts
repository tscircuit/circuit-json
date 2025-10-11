import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_note_line = z
  .object({
    type: z.literal("pcb_note_line"),
    pcb_note_line_id: getZodPrefixedIdWithDefault("pcb_note_line"),
    pcb_component_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    stroke_width: distance.default("0.1mm"),
    color: z.string().optional(),
    is_dashed: z.boolean().optional(),
  })
  .describe("Defines a straight documentation note line on the PCB")

export type PcbNoteLineInput = z.input<typeof pcb_note_line>
type InferredPcbNoteLine = z.infer<typeof pcb_note_line>

/**
 * Defines a straight documentation note line on the PCB
 */
export interface PcbNoteLine {
  type: "pcb_note_line"
  pcb_note_line_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  stroke_width: Distance
  color?: string
  is_dashed?: boolean
}

expectTypesMatch<PcbNoteLine, InferredPcbNoteLine>(true)
