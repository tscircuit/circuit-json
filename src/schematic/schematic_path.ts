import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type Point, point } from "../common/point"
import { distance } from "../units"

export interface SchematicPath {
  type: "schematic_path"
  schematic_path_id: string
  schematic_component_id?: string
  schematic_symbol_id?: string
  fill_color?: string
  is_filled?: boolean
  stroke_width?: number | null
  stroke_color?: string
  dash_length?: number
  dash_gap?: number
  points: Point[]
  subcircuit_id?: string
}

export const schematic_path = z.object({
  type: z.literal("schematic_path"),
  schematic_path_id: getZodPrefixedIdWithDefault("schematic_path"),
  schematic_component_id: z.string().optional(),
  schematic_symbol_id: z.string().optional(),
  fill_color: z.string().optional(),
  is_filled: z.boolean().optional(),
  stroke_width: distance.nullable().optional(),
  stroke_color: z.string().optional(),
  dash_length: distance.optional(),
  dash_gap: distance.optional(),
  points: z.array(point),
  subcircuit_id: z.string().optional(),
})

export type SchematicPathInput = z.input<typeof schematic_path>
type InferredSchematicPath = z.infer<typeof schematic_path>

expectTypesMatch<SchematicPath, InferredSchematicPath>(true)
