import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_diode = source_component_base.extend({
  ftype: z.literal("simple_diode"),
})

export type SourceSimpleDiodeInput = z.input<typeof source_simple_diode>
type InferredSourceSimpleDiode = z.infer<typeof source_simple_diode>

/**
 * Defines a simple diode component
 */
export interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
}

expectTypesMatch<SourceSimpleDiode, InferredSourceSimpleDiode>(true)
