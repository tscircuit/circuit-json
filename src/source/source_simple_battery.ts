import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { battery_capacity } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_battery = source_component_base.extend({
  ftype: z.literal("simple_battery"),
  capacity: battery_capacity,
})

export type SourceSimpleBatteryInput = z.input<typeof source_simple_battery>
type InferredSourceSimpleBattery = z.infer<typeof source_simple_battery>

/**
 * Defines a simple battery component
 */
export interface SourceSimpleBattery extends SourceComponentBase {
  ftype: "simple_battery"
  capacity: number
}

expectTypesMatch<SourceSimpleBattery, InferredSourceSimpleBattery>(true)
