import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { capacitance, resistance, frequency } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_capacitor = source_component_base.extend({
  ftype: z.literal("simple_capacitor"),
  load_capacitance: capacitance,
  pinVariant: z.literal("3pin"),
  equivalent_series_resistance: resistance.optional(),
  frequency: frequency,
})

export type SourceSimpleCapacitorInput = z.input<typeof source_simple_capacitor>
type InferredSourceSimpleCapacitor = z.infer<typeof source_simple_capacitor>

/**
 * Defines a simple capacitor component
 */
export interface SourceSimpleCapacitor extends SourceComponentBase {
  ftype: "simple_capacitor"
  load_capacitance: number
  pinVariant: "3pin"
  equivalent_series_resistance?: number
  frequency: number
}

expectTypesMatch<SourceSimpleCapacitor, InferredSourceSimpleCapacitor>(true)
