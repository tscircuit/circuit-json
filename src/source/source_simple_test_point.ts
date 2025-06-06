import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_test_point = source_component_base.extend({
  ftype: z.literal("simple_test_point"),
  footprint_variant: z.enum(["pad", "through_hole"]).optional(),
  pad_shape: z.enum(["rect", "circle"]).optional(),
  pad_diameter: z.union([z.number(), z.string()]).optional(),
  hole_diameter: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
})

export type SourceSimpleTestPointInput = z.input<
  typeof source_simple_test_point
>
type InferredSourceSimpleTestPoint = z.infer<typeof source_simple_test_point>

/**
 * Defines a simple test point component
 * Can be surface-mount or through-hole.
 * Pad shape and dimensions configurable for different use cases.
 */
export interface SourceSimpleTestPoint extends SourceComponentBase {
  ftype: "simple_test_point"
  footprint_variant?: "pad" | "through_hole"
  pad_shape?: "rect" | "circle"
  pad_diameter?: number | string
  hole_diameter?: number | string
  width?: number | string
  height?: number | string
}

expectTypesMatch<SourceSimpleTestPoint, InferredSourceSimpleTestPoint>(true)
