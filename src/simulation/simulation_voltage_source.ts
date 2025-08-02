import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_voltage_source = z
  .object({
    type: z.literal("simulation_voltage_source"),
    simulation_voltage_source_id: getZodPrefixedIdWithDefault(
      "simulation_voltage_source",
    ),
    positive_source_port_id: z.string(),
    negative_source_port_id: z.string(),
    positive_source_net_id: z.string(),
    negative_source_net_id: z.string(),
    voltage: voltage,
  })
  .describe("Defines a voltage source for simulation")

export type SimulationVoltageSourceInput = z.input<
  typeof simulation_voltage_source
>
type InferredSimulationVoltageSource = z.infer<typeof simulation_voltage_source>

/**
 * Defines a voltage source for simulation purposes. It applies a voltage
 * difference between two source ports.
 */
export interface SimulationVoltageSource {
  type: "simulation_voltage_source"
  simulation_voltage_source_id: string
  positive_source_port_id: string
  positive_source_net_id: string
  negative_source_port_id: string
  negative_source_net_id: string
  voltage: number
}

expectTypesMatch<SimulationVoltageSource, InferredSimulationVoltageSource>(true)
