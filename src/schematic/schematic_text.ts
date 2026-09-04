import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { ninePointAnchor } from "src/common/NinePointAnchor"
import type { NinePointAnchor } from "src/common/NinePointAnchor"
import type { FivePointAnchor } from "src/common/FivePointAnchor"
import { fivePointAnchor } from "src/common/FivePointAnchor"

export interface SchematicText {
  type: "schematic_text"
  schematic_sheet_id?: string
  schematic_component_id?: string
  schematic_symbol_id?: string
  schematic_text_id: string
  /**
   * Set when the text annotates a trace rather than a component, as an inline
   * net label does - the net name drawn alongside a point-to-point wire instead
   * of as an anchored `schematic_net_label`. Lets consumers tell such a label
   * apart from free-standing text and resolve the net it belongs to.
   */
  source_trace_id?: string
  text: string
  text_decoration_ranges?: Array<{
    start: number
    end: number
    decoration: "overline" | "underline" | "line-through"
  }>
  font_size: number
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor: NinePointAnchor | FivePointAnchor
  color: string
  subcircuit_id?: string
}

export const schematic_text = z
  .object({
  type: z.literal("schematic_text"),
  schematic_sheet_id: z.string().optional(),
  schematic_component_id: z.string().optional(),
  schematic_symbol_id: z.string().optional(),
  schematic_text_id: z.string(),
  source_trace_id: z.string().optional(),
  text: z.string(),
  text_decoration_ranges: z
    .array(
      z.object({
        start: z.number().int().nonnegative(),
        end: z.number().int().positive(),
        decoration: z.enum(["overline", "underline", "line-through"]),
      }),
    )
    .optional(),
  font_size: z.number().default(0.18),
  position: z.object({
    x: distance,
    y: distance,
  }),
  rotation: z.number().default(0),
  anchor: z
    .union([fivePointAnchor.describe("legacy"), ninePointAnchor])
    .default("center"),
  color: z.string().default("#000000"),
    subcircuit_id: z.string().optional(),
  })
  .superRefine((value, context) => {
    for (const [index, range] of (
      value.text_decoration_ranges ?? []
    ).entries()) {
      if (range.end <= range.start || range.end > Array.from(value.text).length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["text_decoration_ranges", index],
          message: "Text decoration ranges must be non-empty and within the text",
        })
      }
    }
  })

export type SchematicTextInput = z.input<typeof schematic_text>
type InferredSchematicText = z.infer<typeof schematic_text>

expectTypesMatch<SchematicText, InferredSchematicText>(true)
