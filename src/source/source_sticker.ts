import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_sticker = source_component_base.extend({
  ftype: z.literal("sticker"),
})

export type SourceStickerInput = z.input<typeof source_sticker>
type InferredSourceSticker = z.infer<typeof source_sticker>

/** Defines an adhesive sticker in an assembly. Its placement and appearance
 * are carried by cad_sticker.
 */
export interface SourceSticker extends SourceComponentBase {
  ftype: "sticker"
}

expectTypesMatch<SourceSticker, InferredSourceSticker>(true)
