import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * @deprecated Use source_simple_chip instead. This will be removed in a future version.
 */
export const source_simple_bug = source_component_base
  .extend({
    ftype: z.literal("simple_bug"),
  })
  .describe("@deprecated")

export type SourceSimpleBugInput = z.input<typeof source_simple_bug>
type InferredSourceSimpleBug = z.infer<typeof source_simple_bug>

export interface SourceSimpleBug extends SourceComponentBase {
  ftype: "simple_bug"
}

export type source_simple_bug = InferredSourceSimpleBug

expectTypesMatch<SourceSimpleBug, InferredSourceSimpleBug>(true)
