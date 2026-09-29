import { z } from "zod"
import { asset, type Asset, getZodPrefixedIdWithDefault } from "src/common"
import { point, type Point } from "src/common/point"
import { distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const positiveFiniteDistance = distance.pipe(z.number().positive().finite())

export const schematic_graphic = z
  .object({
    type: z.literal("schematic_graphic"),
    schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
    schematic_sheet_id: z.string().optional(),
    asset: asset.optional(),
    svg_content: z.string().optional(),
    center: point.optional(),
    width: positiveFiniteDistance.optional(),
    height: positiveFiniteDistance.optional(),
    keep_aspect_ratio: z.boolean().optional(),
  })
  .describe(
    "References a graphic asset or inline SVG content with optional centered layout bounds on a schematic sheet",
  )
  .superRefine(({ asset, svg_content }, ctx) => {
    if (asset === undefined && svg_content === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of asset or svg_content is required",
      })
    }
  })

export type SchematicGraphicInput = z.input<typeof schematic_graphic>
type InferredSchematicGraphic = z.infer<typeof schematic_graphic>

/** References a graphic asset or inline SVG content on a schematic sheet. */
export interface SchematicGraphic {
  type: "schematic_graphic"
  schematic_graphic_id: string
  schematic_sheet_id?: string
  /** Optional canonical source asset; at least one graphic source is required. */
  asset?: Asset
  /** Optional inline SVG source or materialized fallback content. */
  svg_content?: string
  /** Optional center position in schematic units. */
  center?: Point
  /** Positive centered layout width in schematic units. */
  width?: number
  /** Positive centered layout height in schematic units. */
  height?: number
  /** Whether the graphic keeps its source aspect ratio inside its bounds. */
  keep_aspect_ratio?: boolean
}

expectTypesMatch<SchematicGraphic, InferredSchematicGraphic>(true)
