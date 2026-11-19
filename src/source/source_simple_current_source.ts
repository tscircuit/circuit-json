import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { current, frequency, ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_current_source = source_component_base.extend({
  ftype: z.literal("simple_current_source"),
  current,
  frequency: frequency.optional(),
  peak_to_peak_current: current.optional(),
  wave_shape: z
    .enum(["sine", "square", "triangle", "sawtooth", "dc"])
    .optional()
    .default("dc"),
  phase: z.number().optional(),
  duty_cycle: z.number().min(0).max(1).optional(),
  pulse_delay: ms.optional(),
  rise_time: ms.optional(),
  fall_time: ms.optional(),
  pulse_width: ms.optional(),
  period: ms.optional(),
})

export type SourceSimpleCurrentSourceInput = z.input<
  typeof source_simple_current_source
>
type InferredSourceSimpleCurrentSource = z.infer<
  typeof source_simple_current_source
>

/**
 * Defines a simple current source component
 */
export interface SourceSimpleCurrentSource extends SourceComponentBase {
  ftype: "simple_current_source"
  current: number
  frequency?: number
  peak_to_peak_current?: number
  wave_shape: "sine" | "square" | "triangle" | "sawtooth" | "dc"
  phase?: number
  duty_cycle?: number
  pulse_delay?: number // ms
  rise_time?: number // ms
  fall_time?: number // ms
  pulse_width?: number // ms
  period?: number // ms
}

expectTypesMatch<SourceSimpleCurrentSource, InferredSourceSimpleCurrentSource>(
  true,
)
