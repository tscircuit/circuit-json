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

export interface SimulationAcSweepCurrentGraph {
  type: "simulation_ac_sweep_current_graph"
  simulation_ac_sweep_current_graph_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  simulation_current_probe_id: string
  frequencies_hz: number[]
  complex_currents: SimulationComplexSample[]
  name?: string
  color?: string
}

export const simulation_ac_sweep_current_graph = z
  .object({
    type: z.literal("simulation_ac_sweep_current_graph"),
    simulation_ac_sweep_current_graph_id: getZodPrefixedIdWithDefault(
      "simulation_ac_sweep_current_graph",
    ),
    simulation_experiment_id: z.string(),
    simulation_parameter_sweep_coordinate:
      simulation_parameter_sweep_coordinate.optional(),
    simulation_current_probe_id: z.string(),
    frequencies_hz: z.array(z.number()),
    complex_currents: z.array(simulation_complex_sample),
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (graph) => graph.frequencies_hz.length === graph.complex_currents.length,
    {
      message: "frequencies_hz and complex_currents must have the same length",
    },
  )

export type SimulationAcSweepCurrentGraphInput = z.input<
  typeof simulation_ac_sweep_current_graph
>
type InferredSimulationAcSweepCurrentGraph = z.infer<
  typeof simulation_ac_sweep_current_graph
>

expectTypesMatch<
  SimulationAcSweepCurrentGraph,
  InferredSimulationAcSweepCurrentGraph
>(true)
