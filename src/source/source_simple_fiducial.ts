import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_fiducial = source_component_base.extend({
  ftype: z.literal("simple_fiducial"),
})

export type SourceSimpleFiducialInput = z.input<typeof source_simple_fiducial>
type InferredSourceSimpleFiducial = z.infer<typeof source_simple_fiducial>

/**
 * Defines a simple fiducial component
 */
export interface SourceSimpleFiducial extends SourceComponentBase {
  ftype: "simple_fiducial"
}

expectTypesMatch<SourceSimpleFiducial, InferredSourceSimpleFiducial>(true)
