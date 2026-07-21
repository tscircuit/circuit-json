import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_unit,
  type SimulationParameterUnit,
} from "./simulation_units"

export const simulation_parameter_type = z.enum([
  "resistance",
  "capacitance",
  "inductance",
  "voltage",
  "current",
])

export type SimulationParameterType = z.infer<typeof simulation_parameter_type>

export interface SimulationParameterSweep {
  type: "simulation_parameter_sweep"
  simulation_parameter_sweep_id: string
  simulation_experiment_id: string
  name?: string
  parameter_type: SimulationParameterType
  resistor_source_component_id?: string
  capacitor_source_component_id?: string
  inductor_source_component_id?: string
  source_net_id?: string
  current_source_component_id?: string
  parameter_values: number[]
  parameter_unit: SimulationParameterUnit
}

export const simulation_parameter_sweep = z
  .object({
    type: z.literal("simulation_parameter_sweep"),
    simulation_parameter_sweep_id: getZodPrefixedIdWithDefault(
      "simulation_parameter_sweep",
    ),
    simulation_experiment_id: z.string(),
    name: z.string().optional(),
    parameter_type: simulation_parameter_type,
    resistor_source_component_id: z.string().optional(),
    capacitor_source_component_id: z.string().optional(),
    inductor_source_component_id: z.string().optional(),
    source_net_id: z.string().optional(),
    current_source_component_id: z.string().optional(),
    parameter_values: z.array(z.number()).min(1),
    parameter_unit: simulation_parameter_unit,
  })
  .superRefine((sweep, context) => {
    const targetFieldByParameterType = {
      resistance: "resistor_source_component_id",
      capacitance: "capacitor_source_component_id",
      inductance: "inductor_source_component_id",
      voltage: "source_net_id",
      current: "current_source_component_id",
    } as const
    const expectedTargetField = targetFieldByParameterType[sweep.parameter_type]
    if (sweep[expectedTargetField] === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [expectedTargetField],
        message: `${expectedTargetField} is required for ${sweep.parameter_type} sweeps`,
      })
    }
  })
  .describe("Repeats a simulation experiment over component parameter values")

export type SimulationParameterSweepInput = z.input<
  typeof simulation_parameter_sweep
>
type InferredSimulationParameterSweep = z.infer<
  typeof simulation_parameter_sweep
>

expectTypesMatch<SimulationParameterSweep, InferredSimulationParameterSweep>(
  true,
)
