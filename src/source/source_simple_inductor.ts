import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { inductance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_inductor = source_component_base.extend({
  ftype: z.literal("simple_inductor"),
  inductance,
  max_current_rating: z.number().optional(),
})

export type SourceSimpleInductorInput = z.input<typeof source_simple_inductor>
type InferredSourceSimpleInductor = z.infer<typeof source_simple_inductor>

/**
 * Defines a simple inductor component
 */
export interface SourceSimpleInductor extends SourceComponentBase {
  ftype: "simple_inductor"
  inductance: number
  max_current_rating?: number
}

expectTypesMatch<SourceSimpleInductor, InferredSourceSimpleInductor>(true)
