import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"
import { voltage } from "../units"

export const source_simple_power_source = source_component_base.extend({
  ftype: z.literal("simple_power_source"),
  voltage,
})

export type SourceSimplePowerSource = z.infer<typeof source_simple_power_source>
export type SourceSimplePowerSourceInput = z.input<
  typeof source_simple_power_source
>
