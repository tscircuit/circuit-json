import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { capacitance, distance, voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_capacitor = source_component_base.extend({
  ftype: z.literal("simple_capacitor"),
  capacitance,
  max_voltage_rating: voltage.optional(),
  display_capacitance: z.string().optional(),
  max_decoupling_trace_length: distance.optional(),
})

export type SourceSimpleCapacitorInput = z.input<typeof source_simple_capacitor>
type InferredSourceSimpleCapacitor = z.infer<typeof source_simple_capacitor>

/**
 * Defines a simple capacitor component
 */
export interface SourceSimpleCapacitor extends SourceComponentBase {
  ftype: "simple_capacitor"
  capacitance: number
  max_voltage_rating?: number
  display_capacitance?: string
  max_decoupling_trace_length?: number
}

expectTypesMatch<SourceSimpleCapacitor, InferredSourceSimpleCapacitor>(true)
