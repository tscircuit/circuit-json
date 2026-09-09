import { z } from "zod"

/** One part of schematic text with its display options. */
export interface SchematicTextPart {
  /** The literal text displayed for this part. */
  text: string
  /** Draw a line above this part, typically indicating an active-low signal. */
  is_overlined?: boolean
}

export const schematic_text_part = z.object({
  text: z.string(),
  is_overlined: z.boolean().optional(),
})
