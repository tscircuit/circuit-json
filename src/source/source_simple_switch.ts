import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_switch = source_component_base.extend({
  ftype: z.literal("simple_switch"),
})
export type SourceSimpleSwitchInput = z.input<typeof source_simple_switch>
type InferredSourceSimpleSwitch = z.infer<typeof source_simple_switch>

/**
 * Defines a simple switch component
 */
export interface SourceSimpleSwitch extends SourceComponentBase {
  ftype: "simple_switch"
}

expectTypesMatch<SourceSimpleSwitch, InferredSourceSimpleSwitch>(true)
