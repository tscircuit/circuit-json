import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_printed_part = source_component_base.extend({
  ftype: z.literal("printedpart"),
})

export type SourcePrintedPartInput = z.input<typeof source_printed_part>
type InferredSourcePrintedPart = z.infer<typeof source_printed_part>

/** Defines a 3D-printed part in an assembly. */
export interface SourcePrintedPart extends SourceComponentBase {
  ftype: "printedpart"
}

expectTypesMatch<SourcePrintedPart, InferredSourcePrintedPart>(true)
