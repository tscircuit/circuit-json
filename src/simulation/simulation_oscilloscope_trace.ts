import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const hasValue = (value: unknown) => value !== undefined

export const simulation_oscilloscope_trace = z
  .object({
    type: z.literal("simulation_oscilloscope_trace"),
    simulation_oscilloscope_trace_id: getZodPrefixedIdWithDefault(
      "simulation_oscilloscope_trace",
    ),
    simulation_transient_voltage_graph_id: z.string().optional(),
    simulation_transient_current_graph_id: z.string().optional(),
    simulation_voltage_probe_id: z.string().optional(),
    simulation_current_probe_id: z.string().optional(),
    display_name: z.string().optional(),
    color: z.string().optional(),
    display_center_value: z.number().optional(),
    display_center_offset_divs: z.number().optional(),
    volts_per_div: z.number().positive().optional(),
    amps_per_div: z.number().positive().optional(),
  })
  .describe(
    "Defines how a simulation measurement is rendered as an oscilloscope-style trace.",
  )
  .superRefine((data, ctx) => {
    const voltageReferences = [
      data.simulation_transient_voltage_graph_id,
      data.simulation_voltage_probe_id,
    ].filter(hasValue).length
    const currentReferences = [
      data.simulation_transient_current_graph_id,
      data.simulation_current_probe_id,
    ].filter(hasValue).length

    if (voltageReferences + currentReferences !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "An oscilloscope trace must reference exactly one voltage graph, current graph, voltage probe, or current probe.",
      })
    }

    if (voltageReferences > 0 && data.amps_per_div !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Voltage oscilloscope traces must use volts_per_div, not amps_per_div.",
      })
    }

    if (currentReferences > 0 && data.volts_per_div !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Current oscilloscope traces must use amps_per_div, not volts_per_div.",
      })
    }
  })

export type SimulationOscilloscopeTraceInput = z.input<
  typeof simulation_oscilloscope_trace
>
type InferredSimulationOscilloscopeTrace = z.infer<
  typeof simulation_oscilloscope_trace
>

/**
 * Defines how a simulation measurement is rendered as an oscilloscope-style
 * trace. Display fields live here because they describe the relationship
 * between measurement data and a graph, not the probe itself.
 *
 * Scope display fields map measured values into display divisions using
 * display_div = display_center_offset_divs + (raw_value - display_center_value) / units_per_div.
 * Use volts_per_div for voltage traces and amps_per_div for current traces.
 */
export interface SimulationOscilloscopeTrace {
  type: "simulation_oscilloscope_trace"
  simulation_oscilloscope_trace_id: string
  simulation_transient_voltage_graph_id?: string
  simulation_transient_current_graph_id?: string
  simulation_voltage_probe_id?: string
  simulation_current_probe_id?: string
  display_name?: string
  color?: string
  display_center_value?: number
  display_center_offset_divs?: number
  volts_per_div?: number
  amps_per_div?: number
}

expectTypesMatch<
  SimulationOscilloscopeTrace,
  InferredSimulationOscilloscopeTrace
>(true)
