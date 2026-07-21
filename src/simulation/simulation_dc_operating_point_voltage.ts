import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SimulationDcOperatingPointVoltage {
  type: "simulation_dc_operating_point_voltage"
  simulation_dc_operating_point_voltage_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_point_id?: string
  simulation_voltage_probe_id: string
  voltage: number
  name?: string
  color?: string
}

export const simulation_dc_operating_point_voltage = z.object({
  type: z.literal("simulation_dc_operating_point_voltage"),
  simulation_dc_operating_point_voltage_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_voltage",
  ),
  simulation_experiment_id: z.string(),
  simulation_parameter_sweep_point_id: z.string().optional(),
  simulation_voltage_probe_id: z.string(),
  voltage: z.number(),
  name: z.string().optional(),
  color: z.string().optional(),
})

export type SimulationDcOperatingPointVoltageInput = z.input<
  typeof simulation_dc_operating_point_voltage
>
type InferredSimulationDcOperatingPointVoltage = z.infer<
  typeof simulation_dc_operating_point_voltage
>

expectTypesMatch<
  SimulationDcOperatingPointVoltage,
  InferredSimulationDcOperatingPointVoltage
>(true)
