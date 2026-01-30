import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { resistance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_potentiometer = source_component_base.extend({
  ftype: z.literal("simple_potentiometer"),
  max_resistance: resistance,
  display_max_resistance: z.string().optional(),
})

export type SourceSimplePotentiometerInput = z.input<
  typeof source_simple_potentiometer
>
type InferredSourceSimplePotentiometer = z.infer<
  typeof source_simple_potentiometer
>

export interface SourceSimplePotentiometer extends SourceComponentBase {
  ftype: "simple_potentiometer"
  max_resistance: number
  display_max_resistance?: string
}

expectTypesMatch<SourceSimplePotentiometer, InferredSourceSimplePotentiometer>(
  true,
)
