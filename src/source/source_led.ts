import { z } from "zod"
import { source_simple_diode } from "./source_simple_diode"

export const source_led = source_simple_diode.extend({
  ftype: z.literal("led"),
})

export type SourceLed = z.infer<typeof source_led>
export type SourceLedInput = z.input<typeof source_led>
