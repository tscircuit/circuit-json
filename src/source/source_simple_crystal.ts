import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_crystal = source_component_base.extend({
  ftype: z.literal("simple_crystal"),
  frequency: z.number().describe("Frequency in Hz"),
  load_capacitance: z.number().optional().describe("Load capacitance in pF"),
})

export type SourceSimpleCrystalInput = z.input<typeof source_simple_crystal>
type InferredSourceSimpleCrystal = z.infer<typeof source_simple_crystal>

/**
 * Defines a simple crystal oscillator component
 */
export interface SourceSimpleCrystal extends SourceComponentBase {
  ftype: "simple_crystal"
  frequency: number
  load_capacitance?: number
}

expectTypesMatch<SourceSimpleCrystal, InferredSourceSimpleCrystal>(true)
