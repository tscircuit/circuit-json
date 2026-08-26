import { z } from "zod"
import { asset, type Asset, getZodPrefixedIdWithDefault } from "src/common"
import { distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const positiveFiniteDistance = distance.pipe(z.number().positive().finite())

export const schematic_graphic = z
  .object({
    type: z.literal("schematic_graphic"),
    schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
    schematic_sheet_id: z.string().optional(),
    asset,
    svg_content: z.string().optional(),
    width: positiveFiniteDistance.optional(),
    height: positiveFiniteDistance.optional(),
  })
  .describe(
    "References a graphic asset with optional centered layout bounds on a schematic sheet",
  )

export type SchematicGraphicInput = z.input<typeof schematic_graphic>
type InferredSchematicGraphic = z.infer<typeof schematic_graphic>

/**
 * References a graphic asset on a schematic sheet. Optional width and height
 * define centered layout bounds; omitted bounds allow full-sheet rendering.
 */
export interface SchematicGraphic {
  type: "schematic_graphic"
  schematic_graphic_id: string
  schematic_sheet_id?: string
  asset: Asset
  svg_content?: string
  /** Positive centered layout width in schematic units. */
  width?: number
  /** Positive centered layout height in schematic units. */
  height?: number
}

expectTypesMatch<SchematicGraphic, InferredSchematicGraphic>(true)
