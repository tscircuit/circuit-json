import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { capacitance, distance, voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  capacitor_role,
  type CapacitorRole,
} from "./properties/trace_length_constraint"

export const source_simple_capacitor = source_component_base.extend({
  ftype: z.literal("simple_capacitor"),
  capacitance,
  max_voltage_rating: voltage.optional(),
  display_capacitance: z.string().optional(),
  max_decoupling_trace_length: distance.optional(),
  max_decoupling_trace_length_origin: z
    .enum(["configured", "automatic"])
    .optional(),
  capacitor_role: capacitor_role.optional(),
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
  max_decoupling_trace_length_origin?: "configured" | "automatic"
  capacitor_role?: CapacitorRole
}

expectTypesMatch<SourceSimpleCapacitor, InferredSourceSimpleCapacitor>(true)
