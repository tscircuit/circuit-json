import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_interconnect = source_component_base.extend({
  ftype: z.literal("interconnect"),
})

export type SourceInterconnectInput = z.input<typeof source_interconnect>
type InferredSourceInterconnect = z.infer<typeof source_interconnect>

/**
 * Defines a generic interconnect component
 */
export interface SourceInterconnect extends SourceComponentBase {
  ftype: "interconnect"
}

expectTypesMatch<SourceInterconnect, InferredSourceInterconnect>(true)
