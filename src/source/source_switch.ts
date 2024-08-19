import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"

export const source_switch = source_component_base.extend({
  ftype: z.enum(["mechanical_spst_switch"]),
})

export type SourceSwitch = z.infer<typeof source_switch>
export type SourceSwitchInput = z.input<typeof source_switch>
