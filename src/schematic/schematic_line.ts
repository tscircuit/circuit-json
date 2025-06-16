import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * Defines a line on the schematic, this can be used for adding arbitrary lines
 * to a schematic, but don't use it for drawing traces, schematic boxes or where
 * other schematic elements are more appropriate.
 */
export interface SchematicLine {
  type: "schematic_line"
  schematic_component_id: string
  x1: number
  x2: number
  y1: number
  y2: number
  subcircuit_id?: string
}

export const schematic_line = z.object({
  type: z.literal("schematic_line"),
  schematic_component_id: z.string(),
  x1: distance,
  x2: distance,
  y1: distance,
  y2: distance,
  subcircuit_id: z.string().optional(),
})

export type SchematicLineInput = z.input<typeof schematic_line>
type InferredSchematicLine = z.infer<typeof schematic_line>

expectTypesMatch<SchematicLine, InferredSchematicLine>(true)
