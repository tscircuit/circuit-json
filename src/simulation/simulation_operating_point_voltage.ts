import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SimulationOperatingPointVoltage {
  type: "simulation_operating_point_voltage"
  simulation_operating_point_voltage_id: string
  simulation_experiment_id: string
  simulation_voltage_probe_id?: string
  voltage: number
  name?: string
  source_node_name?: string
  reference_node_name?: string
  color?: string
}

export const simulation_operating_point_voltage = z
  .object({
    type: z.literal("simulation_operating_point_voltage"),
    simulation_operating_point_voltage_id: getZodPrefixedIdWithDefault(
      "simulation_operating_point_voltage",
    ),
    simulation_experiment_id: z.string(),
    simulation_voltage_probe_id: z.string().optional(),
    voltage,
    name: z.string().optional(),
    source_node_name: z.string().optional(),
    reference_node_name: z.string().optional(),
    color: z.string().optional(),
  })
  .describe("Stores a voltage measured by a DC operating-point experiment")

export type SimulationOperatingPointVoltageInput = z.input<
  typeof simulation_operating_point_voltage
>

expectTypesMatch<
  SimulationOperatingPointVoltage,
  z.infer<typeof simulation_operating_point_voltage>
>(true)
