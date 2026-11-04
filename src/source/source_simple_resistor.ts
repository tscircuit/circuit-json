import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { resistance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_resistor = source_component_base.extend({
  ftype: z.literal("simple_resistor"),
  resistance,
  tolerance: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Resistance tolerance as a fraction (0 to 1)"),
  display_resistance: z.string().optional(),
})

export type SourceSimpleResistorInput = z.input<typeof source_simple_resistor>
type InferredSourceSimpleResistor = z.infer<typeof source_simple_resistor>

/**
 * Defines a simple resistor component
 */
export interface SourceSimpleResistor extends SourceComponentBase {
  ftype: "simple_resistor"
  resistance: number
  tolerance?: number
  display_resistance?: string
}

expectTypesMatch<SourceSimpleResistor, InferredSourceSimpleResistor>(true)
