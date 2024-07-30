import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

/**
 * @deprecated Use source_simple_chip instead. This will be removed in a future version.
 */
export const source_simple_bug = source_component_base.extend({
  ftype: z.literal("simple_bug"),
}).describe('@deprecated')

export type source_simple_bug = z.infer<typeof source_simple_bug>
export type SourceSimpleBugInput = z.input<typeof source_simple_bug>