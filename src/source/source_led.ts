import { z } from "zod"
import { source_simple_diode } from "./source_simple_diode"
import { expectTypesMatch } from "src/utils/expect-types-match"
import type { SourceComponentBase } from "./base/source_component_base"

export const source_led = source_simple_diode.extend({
  ftype: z.literal("led"),
  color: z.string().optional(),
  wavelength: z.string().optional(),
})

export type SourceLedInput = z.input<typeof source_led>
type InferredSourceLed = z.infer<typeof source_led>

/**
 * Defines an LED component that extends the simple diode
 */
export interface SourceLed extends SourceComponentBase {
  ftype: "led"
  color?: string
  wavelength?: string
}

expectTypesMatch<SourceLed, InferredSourceLed>(true)
