import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type Point, point } from "../common/point"

export interface SchematicPath {
  type: "schematic_path"
  schematic_component_id: string
  fill_color?: "red" | "blue"
  is_filled?: boolean
  points: Point[]
  subcircuit_id?: string
}

export const schematic_path = z.object({
  type: z.literal("schematic_path"),
  schematic_component_id: z.string(),
  fill_color: z.enum(["red", "blue"]).optional(),
  is_filled: z.boolean().optional(),
  points: z.array(point),
  subcircuit_id: z.string().optional(),
})

export type SchematicPathInput = z.input<typeof schematic_path>
type InferredSchematicPath = z.infer<typeof schematic_path>

expectTypesMatch<SchematicPath, InferredSchematicPath>(true)
