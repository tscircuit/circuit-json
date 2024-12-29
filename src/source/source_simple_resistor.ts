import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { resistance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_resistor = source_component_base.extend({
  ftype: z.literal("simple_resistor"),
  resistance,
})

export type SourceSimpleResistorInput = z.input<typeof source_simple_resistor>
type InferredSourceSimpleResistor = z.infer<typeof source_simple_resistor>

/**
 * Defines a simple resistor component
 */
export interface SourceSimpleResistor extends SourceComponentBase {
  ftype: "simple_resistor"
  resistance: number
  display_value?: string
}

expectTypesMatch<SourceSimpleResistor, InferredSourceSimpleResistor>(true)
