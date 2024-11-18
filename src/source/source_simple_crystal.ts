import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_crystal = source_component_base.extend({
  ftype: z.literal("simple_crystal"),
  frequency: z.number().describe("Frequency in Hz"),
  load_capacitance: z.number().optional().describe("Load capacitance in pF"),
})

export type SourceSimpleCrystal = z.infer<typeof source_simple_crystal>
export type SourceSimpleCrystalInput = z.input<typeof source_simple_crystal>
