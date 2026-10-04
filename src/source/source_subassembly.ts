import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_subassembly = source_component_base.extend({
  ftype: z.literal("subassembly"),
})

export type SourceSubassemblyInput = z.input<typeof source_subassembly>
type InferredSourceSubassembly = z.infer<typeof source_subassembly>

/** Defines a subassembly component. */
export interface SourceSubassembly extends SourceComponentBase {
  ftype: "subassembly"
}

expectTypesMatch<SourceSubassembly, InferredSourceSubassembly>(true)
