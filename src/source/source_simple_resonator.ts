import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { capacitance, resistance, frequency } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
  load_capacitance: number | string
  equivalent_series_resistance?: number
  frequency: number
}

expectTypesMatch<SourceSimpleResonator, InferredSourceSimpleResonator>(true)
