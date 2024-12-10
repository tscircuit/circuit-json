import { z } from "zod"
import { point, type Point } from "../common/point"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
}

export const schematic_path = z.object({
  type: z.literal("schematic_path"),
  schematic_component_id: z.string(),
  fill_color: z.enum(["red", "blue"]).optional(),
  is_filled: z.boolean().optional(),
  points: z.array(point),
})

export type SchematicPathInput = z.input<typeof schematic_path>
type InferredSchematicPath = z.infer<typeof schematic_path>

expectTypesMatch<SchematicPath, InferredSchematicPath>(true)
