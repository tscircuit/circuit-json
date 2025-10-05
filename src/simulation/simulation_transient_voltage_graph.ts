import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { duration, timestamp } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SimulationTransientVoltageGraph {
  type: "simulation_transient_voltage_graph"
  simulation_transient_voltage_graph_id: string
  simulation_experiment_id: string
  timestamps?: number[]
  voltage_levels: number[]
  schematic_voltage_probe_id?: string
  subcircuit_connecivity_map_key?: string
  time_per_step: number
  start_timestamp: number
  end_timestamp: number
  name?: string
}

export const simulation_transient_voltage_graph = z
  .object({
    type: z.literal("simulation_transient_voltage_graph"),
    simulation_transient_voltage_graph_id: getZodPrefixedIdWithDefault(
      "simulation_transient_voltage_graph",
    ),
    simulation_experiment_id: z.string(),
    timestamps: z.array(timestamp).optional(),
    voltage_levels: z.array(z.number()),
    schematic_voltage_probe_id: z.string().optional(),
    subcircuit_connecivity_map_key: z.string().optional(),
    time_per_step: duration,
    start_timestamp: timestamp,
    end_timestamp: timestamp,
    name: z.string().optional(),
  })
  .describe("Stores voltage measurements over time for a simulation")

export type SimulationTransientVoltageGraphInput = z.input<
  typeof simulation_transient_voltage_graph
>
type InferredSimulationTransientVoltageGraph = z.infer<
  typeof simulation_transient_voltage_graph
>

expectTypesMatch<
  SimulationTransientVoltageGraph,
  InferredSimulationTransientVoltageGraph
>(true)
