import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { resistance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_potentiometer = source_component_base.extend({
  ftype: z.literal("simple_potentiometer"),
  max_resistance: resistance,
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
}

expectTypesMatch<SourceSimplePotentiometer, InferredSourceSimplePotentiometer>(
  true,
)
