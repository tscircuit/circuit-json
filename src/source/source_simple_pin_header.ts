import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_pin_header = source_component_base.extend({
  ftype: z.literal("simple_pin_header"),
  pin_count: z.number(),
  gender: z.enum(["male", "female"]).optional().default("male"),
})

export type SourceSimplePinHeaderInput = z.input<
  typeof source_simple_pin_header
>
type InferredSourceSimplePinHeader = z.infer<typeof source_simple_pin_header>

export interface SourceSimplePinHeader extends SourceComponentBase {
  ftype: "simple_pin_header"
  pin_count: number
  gender: "male" | "female"
}

expectTypesMatch<SourceSimplePinHeader, InferredSourceSimplePinHeader>(true)
