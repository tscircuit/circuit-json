import { z } from "zod"
import { source_component_base } from "src/source/base/source_component_base"
import { resistance } from "src/units"

export const source_simple_potentiometer = source_component_base.extend({
  ftype: z.literal("simple_potentiometer"),
  max_resistance: resistance,
})

export type SourceSimplePotentiometer = z.infer<
  typeof source_simple_potentiometer
>
export type SourceSimplePotentiometerInput = z.input<
  typeof source_simple_potentiometer
>
