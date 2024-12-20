import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"
import { frequency } from "src/units"

export const source_simple_resonator = source_component_base.extend({
  ftype: z.literal("simple_resonator"),
  frequency,
  load_capacitance: z.union([z.string(), z.number()]),
  pin_count: z.number().default(3), // Set the default pin count to 3 for resonators
})

export type SourceSimpleResonator = z.infer<typeof source_simple_resonator>
export type SourceSimpleResonatorInput = z.input<typeof source_simple_resonator>
