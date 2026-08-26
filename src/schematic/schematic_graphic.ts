import { z } from "zod"
import { asset, type Asset, getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_graphic = z
  .object({
    type: z.literal("schematic_graphic"),
    schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
    schematic_sheet_id: z.string().optional(),
    asset,
    svg_content: z.string().optional(),
  })
  .describe("References a graphic asset on a schematic sheet")

export type SchematicGraphicInput = z.input<typeof schematic_graphic>
type InferredSchematicGraphic = z.infer<typeof schematic_graphic>

/**
 * References a graphic asset on a schematic sheet.
 */
export interface SchematicGraphic {
  type: "schematic_graphic"
  schematic_graphic_id: string
  schematic_sheet_id?: string
  asset: Asset
  svg_content?: string
}

expectTypesMatch<SchematicGraphic, InferredSchematicGraphic>(true)
