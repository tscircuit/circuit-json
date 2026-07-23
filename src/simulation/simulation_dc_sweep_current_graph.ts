import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_dc_sweep_unit,
  type SimulationDcSweepUnit,
} from "./simulation_units"
import {
  simulation_parameter_sweep_coordinate,
  type SimulationParameterSweepCoordinate,
} from "./simulation_parameter_sweep_coordinate"

export interface SimulationDcSweepCurrentGraph {
  type: "simulation_dc_sweep_current_graph"
  simulation_dc_sweep_current_graph_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  simulation_current_probe_id: string
  sweep_values: number[]
  sweep_unit: SimulationDcSweepUnit
  current_levels: number[]
  name?: string
  color?: string
}

export const simulation_dc_sweep_current_graph = z
  .object({
    type: z.literal("simulation_dc_sweep_current_graph"),
    simulation_dc_sweep_current_graph_id: getZodPrefixedIdWithDefault(
      "simulation_dc_sweep_current_graph",
    ),
    simulation_experiment_id: z.string(),
    simulation_parameter_sweep_coordinate:
      simulation_parameter_sweep_coordinate.optional(),
    simulation_current_probe_id: z.string(),
    sweep_values: z.array(z.number()),
    sweep_unit: simulation_dc_sweep_unit,
    current_levels: z.array(z.number()),
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (graph) => graph.sweep_values.length === graph.current_levels.length,
    {
      message: "sweep_values and current_levels must have the same length",
    },
  )

export type SimulationDcSweepCurrentGraphInput = z.input<
  typeof simulation_dc_sweep_current_graph
>
type InferredSimulationDcSweepCurrentGraph = z.infer<
  typeof simulation_dc_sweep_current_graph
>

expectTypesMatch<
  SimulationDcSweepCurrentGraph,
  InferredSimulationDcSweepCurrentGraph
>(true)
