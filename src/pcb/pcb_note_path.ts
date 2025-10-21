import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_note_path = z
  .object({
    type: z.literal("pcb_note_path"),
    pcb_note_path_id: getZodPrefixedIdWithDefault("pcb_note_path"),
    pcb_component_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    name: z.string().optional(),
    text: z.string().optional(),
    route: z.array(point),
    stroke_width: length.default("0.1mm"),
    color: z.string().optional(),
  })
  .describe("Defines a polyline documentation note on the PCB")

export type PcbNotePathInput = z.input<typeof pcb_note_path>
type InferredPcbNotePath = z.infer<typeof pcb_note_path>

/**
 * Defines a polyline documentation note on the PCB
 */
export interface PcbNotePath {
  type: "pcb_note_path"
  pcb_note_path_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  text?: string
  route: Point[]
  stroke_width: Length
  color?: string
}

expectTypesMatch<PcbNotePath, InferredPcbNotePath>(true)
