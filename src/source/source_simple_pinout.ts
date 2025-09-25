import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_pinout = source_component_base.extend({
  ftype: z.literal("simple_pinout"),
})

export type SourceSimplePinoutInput = z.input<typeof source_simple_pinout>
type InferredSourceSimplePinout = z.infer<typeof source_simple_pinout>

/**
 * Defines a simple pinout component
 */
export interface SourceSimplePinout extends SourceComponentBase {
  ftype: "simple_pinout"
}

expectTypesMatch<SourceSimplePinout, InferredSourceSimplePinout>(true)
