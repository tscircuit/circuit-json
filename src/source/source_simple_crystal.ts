import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { capacitance, frequency } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_crystal = source_component_base.extend({
  ftype: z.literal("simple_crystal"),
  frequency: frequency.describe("Frequency in Hz"),
  display_frequency: z.string().optional(),
  load_capacitance: capacitance.optional().describe("Load capacitance in pF"),
  display_load_capacitance: z.string().optional(),
  pin_variant: z.enum(["two_pin", "four_pin"]).optional(),
})

export type SourceSimpleCrystalInput = z.input<typeof source_simple_crystal>
type InferredSourceSimpleCrystal = z.infer<typeof source_simple_crystal>

/**
 * Defines a simple crystal oscillator component
 */
export interface SourceSimpleCrystal extends SourceComponentBase {
  ftype: "simple_crystal"
  frequency: number
  display_frequency?: string
  load_capacitance?: number
  display_load_capacitance?: string
  pin_variant?: "two_pin" | "four_pin"
}

expectTypesMatch<SourceSimpleCrystal, InferredSourceSimpleCrystal>(true)
