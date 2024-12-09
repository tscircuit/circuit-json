import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { voltage } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_power_source = source_component_base.extend({
  ftype: z.literal("simple_power_source"),
  voltage,
})

export type SourceSimplePowerSourceInput = z.input<
  typeof source_simple_power_source
>
type InferredSourceSimplePowerSource = z.infer<
  typeof source_simple_power_source
>

/**
 * Defines a simple power source component
 */
export interface SourceSimplePowerSource extends SourceComponentBase {
  ftype: "simple_power_source"
  voltage: number
}

expectTypesMatch<SourceSimplePowerSource, InferredSourceSimplePowerSource>(true)
