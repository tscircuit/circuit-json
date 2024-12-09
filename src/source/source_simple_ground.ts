import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_ground = source_component_base.extend({
  ftype: z.literal("simple_ground"),
})

export type SourceSimpleGroundInput = z.input<typeof source_simple_ground>
type InferredSourceSimpleGround = z.infer<typeof source_simple_ground>

/**
 * Defines a simple ground component
 */
export interface SourceSimpleGround extends SourceComponentBase {
  ftype: "simple_ground"
}

expectTypesMatch<SourceSimpleGround, InferredSourceSimpleGround>(true)
