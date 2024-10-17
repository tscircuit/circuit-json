import { z } from "zod"
import { source_component_base } from "src/source/base/source_component_base"
import { battery_capacity } from "src/units"

export const source_simple_battery = source_component_base.extend({
  ftype: z.literal("simple_battery"),
  capacity: battery_capacity,
})

export type SourceSimpleBattery = z.infer<typeof source_simple_battery>
export type SourceSimpleBatteryInput = z.input<typeof source_simple_battery>
