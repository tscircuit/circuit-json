import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicSection {
  type: "schematic_section"
  schematic_component_id?: string
  schematic_section_id: string
  width: number
  height: number
  position: {
    x: number
    y: number
  }
  rotation: number
  color: string
}

export const schematic_section = z.object({
  type: z.literal("schematic_section"),
  schematic_component_id: z.string().optional(),
  schematic_section_id: z.string(),
  width: distance,
  height: distance,
  position: z.object({
    x: distance,
    y: distance,
  }),
  rotation: z.number().default(0),
  color: z.string().default("#000000"),
})

export type SchematicSectionInput = z.input<typeof schematic_section>
type InferredSchematicSection = z.infer<typeof schematic_section>

expectTypesMatch<SchematicSection, InferredSchematicSection>(true)
