import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { frequency, capacitance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_resonator = source_component_base.extend({
  ftype: z.literal("simple_resonator"),
  frequency,
  capacitance,
  pin_count: z.number().default(3), // Set the default pin count to 3 for resonators
})

export type SourceSimpleResonatorInput = z.input<typeof source_simple_resonator>
type InferredSourceSimpleResonator = z.infer<typeof source_simple_resonator>

/**
 * Defines a simple resonator component
 */
export interface SourceSimpleResonator extends SourceComponentBase {
  ftype: "simple_resonator"
  frequency: number
  capacitance: number
  pin_count: number
}

expectTypesMatch<SourceSimpleResonator, InferredSourceSimpleResonator>(true)
