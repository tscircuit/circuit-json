import { z } from "zod"
import {
    source_component_base,
    type SourceComponentBase,
} from "src/source/base/source_component_base"
import { voltage, frequency, rotation } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_voltage_source = source_component_base.extend({
    ftype: z.literal("simple_voltage_source"),
    voltage,
    frequency: frequency.optional(),
    peak_to_peak_voltage: voltage.optional(),
    wave_shape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
    phase: rotation.optional(),
    duty_cycle: z.number().optional().describe("Duty cycle as a fraction (0 to 1)"),
})

export type SourceSimpleVoltageSourceInput = z.input<
    typeof source_simple_voltage_source
>
type InferredSourceSimpleVoltageSource = z.infer<
    typeof source_simple_voltage_source
>

/**
 * Defines a simple voltage source component
 */
export interface SourceSimpleVoltageSource extends SourceComponentBase {
    ftype: "simple_voltage_source"
    voltage: number
    frequency?: number
    peak_to_peak_voltage?: number
    wave_shape?: "sinewave" | "square" | "triangle" | "sawtooth"
    phase?: number
    duty_cycle?: number
}

expectTypesMatch<SourceSimpleVoltageSource, InferredSourceSimpleVoltageSource>(
    true,
)
