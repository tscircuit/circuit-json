import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_ammeter = source_component_base.extend({
  ftype: z.literal("simple_ammeter"),
})

export type SourceSimpleAmmeterInput = z.input<typeof source_simple_ammeter>
type InferredSourceSimpleAmmeter = z.infer<typeof source_simple_ammeter>

/**
 * Defines a simple ammeter component for simulation and measurement
 */
export interface SourceSimpleAmmeter extends SourceComponentBase {
  ftype: "simple_ammeter"
}

expectTypesMatch<SourceSimpleAmmeter, InferredSourceSimpleAmmeter>(true)
