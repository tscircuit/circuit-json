import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_rotary_switch = source_component_base.extend({
  ftype: z.literal("simple_rotary_switch"),
  poles: z.number().int().min(1).optional().default(1),
  positions: z.number().int().min(2),
})

export type SourceSimpleRotarySwitchInput = z.input<
  typeof source_simple_rotary_switch
>
type InferredSourceSimpleRotarySwitch = z.infer<
  typeof source_simple_rotary_switch
>

/**
 * Defines a multi-position rotary selector switch (N poles × M positions).
 * Physical pin numbering follows KiCad's `Switch:SW_Rotary_NxM` convention:
 * throw pins are `1 .. poles * positions` (`(pole - 1) * positions + pos`)
 * and common (wiper) pins are `poles * positions + 1 .. poles * (positions + 1)`.
 */
export interface SourceSimpleRotarySwitch extends SourceComponentBase {
  ftype: "simple_rotary_switch"
  poles: number
  positions: number
}

expectTypesMatch<SourceSimpleRotarySwitch, InferredSourceSimpleRotarySwitch>(
  true,
)
