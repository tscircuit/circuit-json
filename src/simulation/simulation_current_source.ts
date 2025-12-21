import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { current, frequency, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  wave_shape,
  type WaveShape,
} from "src/simulation/simulation_voltage_source"

const percentage = z
  .union([z.string(), z.number()])
  .transform((val) => {
    if (typeof val === "string") {
      if (val.endsWith("%")) {
        return parseFloat(val.slice(0, -1)) / 100
      }
      return parseFloat(val)
    }
    return val
  })
  .pipe(
    z
      .number()
      .min(0, "Duty cycle must be non-negative")
      .max(1, "Duty cycle cannot be greater than 100%"),
  )

export const simulation_dc_current_source = z
  .object({
    type: z.literal("simulation_current_source"),
    simulation_current_source_id: getZodPrefixedIdWithDefault(
      "simulation_current_source",
    ),
    is_dc_source: z.literal(true).optional().default(true),
    positive_source_port_id: z.string().optional(),
    negative_source_port_id: z.string().optional(),
    positive_source_net_id: z.string().optional(),
    negative_source_net_id: z.string().optional(),
    current: current,
  })
  .describe("Defines a DC current source for simulation")

export const simulation_ac_current_source = z
  .object({
    type: z.literal("simulation_current_source"),
    simulation_current_source_id: getZodPrefixedIdWithDefault(
      "simulation_current_source",
    ),
    is_dc_source: z.literal(false),
    terminal1_source_port_id: z.string().optional(),
    terminal2_source_port_id: z.string().optional(),
    terminal1_source_net_id: z.string().optional(),
    terminal2_source_net_id: z.string().optional(),
    current: current.optional(),
    frequency: frequency.optional(),
    peak_to_peak_current: current.optional(),
    wave_shape: wave_shape.optional(),
    phase: rotation.optional(),
    duty_cycle: percentage.optional(),
  })
  .describe("Defines an AC current source for simulation")

export type SimulationAcCurrentSourceInput = z.input<
  typeof simulation_ac_current_source
>

export const simulation_current_source = z
  .union([simulation_dc_current_source, simulation_ac_current_source])
  .describe("Defines a current source for simulation")

export type SimulationCurrentSourceInput = z.input<
  typeof simulation_current_source
>
type InferredSimulationCurrentSource = z.infer<typeof simulation_current_source>

/**
 * Defines a DC current source for simulation purposes. It forces a current
 * between two source ports.
 */
export interface SimulationDcCurrentSource {
  type: "simulation_current_source"
  simulation_current_source_id: string
  is_dc_source: true
  positive_source_port_id?: string
  positive_source_net_id?: string
  negative_source_port_id?: string
  negative_source_net_id?: string
  current: number
}

/**
 * Defines an AC current source for simulation purposes.
 */
export interface SimulationAcCurrentSource {
  type: "simulation_current_source"
  simulation_current_source_id: string
  is_dc_source: false
  terminal1_source_port_id?: string
  terminal2_source_port_id?: string
  terminal1_source_net_id?: string
  terminal2_source_net_id?: string
  current?: number
  frequency?: number
  peak_to_peak_current?: number
  wave_shape?: WaveShape
  phase?: number
  duty_cycle?: number
}

export type SimulationCurrentSource =
  | SimulationDcCurrentSource
  | SimulationAcCurrentSource

expectTypesMatch<
  SimulationDcCurrentSource,
  z.infer<typeof simulation_dc_current_source>
>(true)
expectTypesMatch<
  SimulationAcCurrentSource,
  z.infer<typeof simulation_ac_current_source>
>(true)
expectTypesMatch<SimulationCurrentSource, InferredSimulationCurrentSource>(true)
