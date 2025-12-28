import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_op_amp = source_component_base.extend({
  ftype: z.literal("simple_op_amp"),
})

export type SourceSimpleOpAmpInput = z.input<typeof source_simple_op_amp>
type InferredSourceSimpleOpAmp = z.infer<typeof source_simple_op_amp>

/**
 * Defines a simple op-amp component
 */
export interface SourceSimpleOpAmp extends SourceComponentBase {
  ftype: "simple_op_amp"
}

expectTypesMatch<SourceSimpleOpAmp, InferredSourceSimpleOpAmp>(true)
