import { z } from "zod"
import { source_component_base } from "src/source/base/source_component_base"
import { battery_capacity } from "src/units"

export const simple_source_battery = source_component_base.extend({
  ftype: z.literal("simple_battery"),
  capacity: battery_capacity,
})

export type SourceBattery = z.infer<typeof simple_source_battery>
export type SourceBatteryInput = z.input<typeof simple_source_battery>
