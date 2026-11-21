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

interface SimulationParameterSweepBase {
  type: "simulation_parameter_sweep"
  simulation_parameter_sweep_id: string
  simulation_experiment_id: string
  name?: string
  parameter_values: number[]
  parameter_unit: SimulationParameterUnit
  display_parameter_values?: number[]
  display_parameter_unit?: string
}

export interface SimulationResistanceParameterSweep
  extends SimulationParameterSweepBase {
  parameter_type: "resistance"
  resistor_source_component_id: string
}

export interface SimulationCapacitanceParameterSweep
  extends SimulationParameterSweepBase {
  parameter_type: "capacitance"
  capacitor_source_component_id: string
}

export interface SimulationInductanceParameterSweep
  extends SimulationParameterSweepBase {
  parameter_type: "inductance"
  inductor_source_component_id: string
}

export interface SimulationVoltageParameterSweep
  extends SimulationParameterSweepBase {
  parameter_type: "voltage"
  source_net_id: string
}

export interface SimulationCurrentParameterSweep
  extends SimulationParameterSweepBase {
  parameter_type: "current"
  current_source_component_id: string
}

export type SimulationParameterSweep =
  | SimulationResistanceParameterSweep
  | SimulationCapacitanceParameterSweep
  | SimulationInductanceParameterSweep
  | SimulationVoltageParameterSweep
  | SimulationCurrentParameterSweep

const simulation_parameter_sweep_base = z.object({
  type: z.literal("simulation_parameter_sweep"),
  simulation_parameter_sweep_id: getZodPrefixedIdWithDefault(
    "simulation_parameter_sweep",
  ),
  simulation_experiment_id: z.string(),
  name: z.string().optional(),
  parameter_values: z.array(z.number()).min(1),
  parameter_unit: simulation_parameter_unit,
  display_parameter_values: z.array(z.number()).min(1).optional(),
  display_parameter_unit: z.string().min(1).optional(),
})

export const simulation_parameter_sweep = z
  .discriminatedUnion("parameter_type", [
    simulation_parameter_sweep_base.extend({
      parameter_type: z.literal("resistance"),
      resistor_source_component_id: z.string(),
    }),
    simulation_parameter_sweep_base.extend({
      parameter_type: z.literal("capacitance"),
      capacitor_source_component_id: z.string(),
    }),
    simulation_parameter_sweep_base.extend({
      parameter_type: z.literal("inductance"),
      inductor_source_component_id: z.string(),
    }),
    simulation_parameter_sweep_base.extend({
      parameter_type: z.literal("voltage"),
      source_net_id: z.string(),
    }),
    simulation_parameter_sweep_base.extend({
      parameter_type: z.literal("current"),
      current_source_component_id: z.string(),
    }),
  ])
  .superRefine((parameterSweep, context) => {
    const hasDisplayValues =
      parameterSweep.display_parameter_values !== undefined
    const hasDisplayUnit = parameterSweep.display_parameter_unit !== undefined
    if (hasDisplayValues !== hasDisplayUnit) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "display_parameter_values and display_parameter_unit must be provided together",
      })
    }
    if (
      parameterSweep.display_parameter_values &&
      parameterSweep.display_parameter_values.length !==
        parameterSweep.parameter_values.length
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["display_parameter_values"],
        message:
          "display_parameter_values and parameter_values must have the same length",
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
