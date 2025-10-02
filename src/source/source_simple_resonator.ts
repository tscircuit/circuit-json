import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { capacitance, frequency, resistance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_resonator = source_component_base.extend({
  ftype: z.literal("simple_resonator"),
  load_capacitance: capacitance,
  equivalent_series_resistance: resistance.optional(),
  frequency: frequency,
})

export type SourceSimpleResonatorInput = z.input<typeof source_simple_resonator>
type InferredSourceSimpleResonator = z.infer<typeof source_simple_resonator>

/**
 * Defines a simple resonator component
 */
export interface SourceSimpleResonator extends SourceComponentBase {
  ftype: "simple_resonator"
  load_capacitance: number
  equivalent_series_resistance?: number
  frequency: number
}

expectTypesMatch<SourceSimpleResonator, InferredSourceSimpleResonator>(true)
