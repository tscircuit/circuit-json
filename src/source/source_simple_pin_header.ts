import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_pin_header = source_component_base.extend({
  ftype: z.literal("simple_pin_header"),
  pin_count: z.number(),
  gender: z.enum(["male", "female"]).default("male"),
})

export type SourceSimplePinHeader = z.infer<typeof source_simple_pin_header>
export type SourceSimplePinHeaderInput = z.input<
  typeof source_simple_pin_header
>
