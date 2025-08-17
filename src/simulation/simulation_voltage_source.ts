import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { frequency, rotation, voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const wave_shape = z.enum(["sinewave", "square", "triangle", "sawtooth"])
export type WaveShape = z.infer<typeof wave_shape>

export const simulation_dc_voltage_source = z
  .object({
    type: z.literal("simulation_voltage_source"),
    simulation_voltage_source_id: getZodPrefixedIdWithDefault(
      "simulation_voltage_source",
    ),
    is_dc_source: z.literal(true).optional().default(true),
    positive_source_port_id: z.string(),
    negative_source_port_id: z.string(),
    positive_source_net_id: z.string(),
    negative_source_net_id: z.string(),
    voltage: voltage,
  })
  .describe("Defines a DC voltage source for simulation")

export const simulation_ac_voltage_source = z
  .object({
    type: z.literal("simulation_voltage_source"),
    simulation_voltage_source_id: getZodPrefixedIdWithDefault(
      "simulation_voltage_source",
    ),
    is_dc_source: z.literal(false),
    terminal1_source_port_id: z.string(),
    terminal2_source_port_id: z.string(),
    terminal1_source_net_id: z.string(),
    terminal2_source_net_id: z.string(),
    voltage: voltage.optional(),
    frequency: frequency.optional(),
    peak_to_peak_voltage: voltage.optional(),
    wave_shape: wave_shape.optional(),
    phase: rotation.optional(),
  })
  .describe("Defines an AC voltage source for simulation")

export const simulation_voltage_source = z
  .union([simulation_dc_voltage_source, simulation_ac_voltage_source])
  .describe("Defines a voltage source for simulation")

export type SimulationVoltageSourceInput = z.input<
  typeof simulation_voltage_source
>
type InferredSimulationVoltageSource = z.infer<typeof simulation_voltage_source>

/**
 * Defines a DC voltage source for simulation purposes. It applies a voltage
 * difference between two source ports.
 */
export interface SimulationDcVoltageSource {
  type: "simulation_voltage_source"
  simulation_voltage_source_id: string
  is_dc_source: true
  positive_source_port_id: string
  positive_source_net_id: string
  negative_source_port_id: string
  negative_source_net_id: string
  voltage: number
}

/**
 * Defines an AC voltage source for simulation purposes.
 */
export interface SimulationAcVoltageSource {
  type: "simulation_voltage_source"
  simulation_voltage_source_id: string
  is_dc_source: false
  terminal1_source_port_id: string
  terminal2_source_port_id: string
  terminal1_source_net_id: string
  terminal2_source_net_id: string
  voltage?: number
  frequency?: number
  peak_to_peak_voltage?: number
  wave_shape?: WaveShape
  phase?: number
}

export type SimulationVoltageSource =
  | SimulationDcVoltageSource
  | SimulationAcVoltageSource

expectTypesMatch<
  SimulationDcVoltageSource,
  z.infer<typeof simulation_dc_voltage_source>
>(true)
expectTypesMatch<
  SimulationAcVoltageSource,
  z.infer<typeof simulation_ac_voltage_source>
>(true)
expectTypesMatch<SimulationVoltageSource, InferredSimulationVoltageSource>(true)
