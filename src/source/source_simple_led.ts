import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_led = source_component_base.extend({
  ftype: z.literal("simple_led"),
})

export type SourceSimpleLedInput = z.input<typeof source_simple_led>
type InferredSourceSimpleLed = z.infer<typeof source_simple_led>

/**
 * Defines a simple led component
 */
export interface SourceSimpleLed extends SourceComponentBase {
  ftype: "simple_led"
}

expectTypesMatch<SourceSimpleLed, InferredSourceSimpleLed>(true)
