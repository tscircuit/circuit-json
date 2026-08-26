import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_graphic = z
  .object({
    type: z.literal("schematic_graphic"),
    schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
    schematic_sheet_id: z.string().optional(),
    svg_content: z.string(),
  })
  .describe("Embeds SVG content on a schematic sheet")

export type SchematicGraphicInput = z.input<typeof schematic_graphic>
type InferredSchematicGraphic = z.infer<typeof schematic_graphic>

/**
 * Embeds SVG content on a schematic sheet.
 */
export interface SchematicGraphic {
  type: "schematic_graphic"
  schematic_graphic_id: string
  schematic_sheet_id?: string
  svg_content: string
}

expectTypesMatch<SchematicGraphic, InferredSchematicGraphic>(true)
