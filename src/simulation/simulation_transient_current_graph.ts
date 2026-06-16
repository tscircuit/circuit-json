import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { duration_ms, ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SimulationTransientCurrentGraph {
  type: "simulation_transient_current_graph"
  simulation_transient_current_graph_id: string
  simulation_experiment_id: string
  timestamps_ms?: number[]
  current_levels: number[]
  source_component_id?: string
  subcircuit_connectivity_map_key?: string
  time_per_step: number
  start_time_ms: number
  end_time_ms: number
  name?: string
  color?: string
}

export const simulation_transient_current_graph = z
  .object({
    type: z.literal("simulation_transient_current_graph"),
    simulation_transient_current_graph_id: getZodPrefixedIdWithDefault(
      "simulation_transient_current_graph",
    ),
    simulation_experiment_id: z.string(),
    timestamps_ms: z.array(z.number()).optional(),
    current_levels: z.array(z.number()),
    source_component_id: z.string().optional(),
    subcircuit_connectivity_map_key: z.string().optional(),
    time_per_step: duration_ms,
    start_time_ms: ms,
    end_time_ms: ms,
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .describe("Stores current measurements over time for a simulation")

export type SimulationTransientCurrentGraphInput = z.input<
  typeof simulation_transient_current_graph
>
type InferredSimulationTransientCurrentGraph = z.infer<
  typeof simulation_transient_current_graph
>

expectTypesMatch<
  SimulationTransientCurrentGraph,
  InferredSimulationTransientCurrentGraph
>(true)
