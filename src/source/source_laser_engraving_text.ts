import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "../utils/expect-types-match"

export const source_laser_engraving_text = z
  .object({
    type: z.literal("source_laser_engraving_text"),
    source_laser_engraving_text_id: z.string().min(1),
    source_component_id: z
      .string()
      .min(1)
      .describe("Source component ID of the part that is engraved."),
    name: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Name of the engraving, unique within the engraved part."),
    text: z
      .string()
      .refine((value) => value.trim().length > 0, "Text must not be blank")
      .describe("The text to engrave."),
    engraving_depth: distance
      .pipe(z.number().finite().positive())
      .optional()
      .describe(
        "Depth of material removed, in millimeters. Omission means a surface mark with no specified depth.",
      ),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "A manufacturing step that laser engraves text onto an assembly part. It records what is engraved and how; where the text sits in 3D is in the linked cad_laser_engraving_text.",
  )

export type SourceLaserEngravingTextInput = z.input<
  typeof source_laser_engraving_text
>

/** A manufacturing step that laser engraves text onto an assembly part. It
 * records what is engraved and how: the part, the text and the depth of
 * material removed in mm. engraving_depth adds no default when omitted. Where
 * the text sits in 3D is in the cad_laser_engraving_text that links to it.
 */
export interface SourceLaserEngravingText {
  type: "source_laser_engraving_text"
  source_laser_engraving_text_id: string
  source_component_id: string
  name?: string
  text: string
  engraving_depth?: number
  subcircuit_id?: string
}

expectTypesMatch<
  SourceLaserEngravingText,
  z.infer<typeof source_laser_engraving_text>
>(true)
