import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_note_dimension = z
  .object({
    type: z.literal("pcb_note_dimension"),
    pcb_note_dimension_id: getZodPrefixedIdWithDefault("pcb_note_dimension"),
    pcb_component_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    name: z.string().optional(),
    from: point,
    to: point,
    text: z.string().optional(),
    text_ccw_rotation: z.number().optional(),
    offset_distance: length.optional(),
    offset_direction: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: length.default("1mm"),
    color: z.string().optional(),
    arrow_size: length.default("1mm"),
  })
  .describe("Defines a measurement annotation within PCB documentation notes")

export type PcbNoteDimensionInput = z.input<typeof pcb_note_dimension>
type InferredPcbNoteDimension = z.infer<typeof pcb_note_dimension>

/**
 * Defines a measurement annotation within PCB documentation notes
 */
export interface PcbNoteDimension {
  type: "pcb_note_dimension"
  pcb_note_dimension_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  from: Point
  to: Point
  text?: string
  text_ccw_rotation?: number
  offset_distance?: Length
  offset_direction?: {
    x: number
    y: number
  }
  font: "tscircuit2024"
  font_size: Length
  color?: string
  arrow_size: Length
}

expectTypesMatch<PcbNoteDimension, InferredPcbNoteDimension>(true)
