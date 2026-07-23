import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_complex_sample,
  type SimulationComplexSample,
} from "./simulation_complex_sample"
import {
  simulation_parameter_sweep_coordinate,
  type SimulationParameterSweepCoordinate,
} from "./simulation_parameter_sweep_coordinate"

export interface SimulationAcSweepVoltageGraph {
  type: "simulation_ac_sweep_voltage_graph"
  simulation_ac_sweep_voltage_graph_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  simulation_voltage_probe_id: string
  frequencies_hz: number[]
  complex_voltages: SimulationComplexSample[]
  name?: string
  color?: string
}

export const simulation_ac_sweep_voltage_graph = z
  .object({
    type: z.literal("simulation_ac_sweep_voltage_graph"),
    simulation_ac_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
      "simulation_ac_sweep_voltage_graph",
    ),
    simulation_experiment_id: z.string(),
    simulation_parameter_sweep_coordinate:
      simulation_parameter_sweep_coordinate.optional(),
    simulation_voltage_probe_id: z.string(),
    frequencies_hz: z.array(z.number()),
    complex_voltages: z.array(simulation_complex_sample),
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (graph) => graph.frequencies_hz.length === graph.complex_voltages.length,
    {
      message: "frequencies_hz and complex_voltages must have the same length",
    },
  )

export type SimulationAcSweepVoltageGraphInput = z.input<
  typeof simulation_ac_sweep_voltage_graph
>
type InferredSimulationAcSweepVoltageGraph = z.infer<
  typeof simulation_ac_sweep_voltage_graph
>

expectTypesMatch<
  SimulationAcSweepVoltageGraph,
  InferredSimulationAcSweepVoltageGraph
>(true)
