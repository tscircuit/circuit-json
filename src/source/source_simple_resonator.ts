import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_resonator = source_component_base.extend({
  ftype: z.literal("resonator"),
  frequency: z.union([z.string(), z.number()]),
  load_capacitance: z.union([z.string(), z.number()]),
  pin_count: z.number().default(3), // Set the default pin count to 3 for resonators
  gender: z.enum(["male", "female"]).optional().default("male"),
})

export type SourceSimpleResonator = z.infer<typeof source_simple_resonator>
export type SourceSimpleResonatorInput = z.input<typeof source_simple_resonator>
