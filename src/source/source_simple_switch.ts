import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_simple_switch = source_component_base.extend({
  ftype: z.literal("mechanical_spst_switch"),
  state: z.enum(["open", "closed"]).default("open"),
})

export type SourceSimpleSwitch = z.infer<typeof source_simple_switch>
export type SourceSimpleSwitchInput = z.input<typeof source_simple_switch>