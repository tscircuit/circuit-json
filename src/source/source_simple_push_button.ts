import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_push_button = source_component_base.extend({
  ftype: z.literal("simple_push_button"),
})

export type SourceSimplePushbutton = z.infer<typeof source_simple_push_button>
export type SourceSimplePushbuttonInput = z.input<
  typeof source_simple_push_button
>
