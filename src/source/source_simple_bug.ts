import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_bug = source_component_base.extend({
  ftype: z.literal("simple_bug"),
})

export type SourceSimpleBug = z.infer<typeof source_simple_bug>
export type SourceSimpleBugInput = z.input<typeof source_simple_bug>
