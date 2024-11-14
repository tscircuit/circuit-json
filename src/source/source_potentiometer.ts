import { z } from "zod"
import { source_component_base } from "src/source/base/source_component_base"
import { resistance } from "src/units"

export const source_potentiometer = source_component_base.extend({
  ftype: z.literal("potentiometer"),
  max_resistance: resistance,
})

export type SourcePotentiometer = z.infer<typeof source_potentiometer>
export type SourcePotentiometerInput = z.input<typeof source_potentiometer>
