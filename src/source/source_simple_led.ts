import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  source_simple_diode,
  type SourceSimpleDiode,
} from "./source_simple_diode"

export const source_simple_led = source_simple_diode.extend({
  ftype: z.literal("simple_led"),
  color: z.string().optional(),
  wavelength: z.string().optional(),
})

export type SourceSimpleLedInput = z.input<typeof source_simple_led>
type InferredSourceSimpleLed = z.infer<typeof source_simple_led>

/**
 * Defines a simple led component
 */
export interface SourceSimpleLed extends Omit<SourceSimpleDiode, "ftype"> {
  ftype: "simple_led"
  color?: string
  wavelength?: string
}

expectTypesMatch<SourceSimpleLed, InferredSourceSimpleLed>(true)
