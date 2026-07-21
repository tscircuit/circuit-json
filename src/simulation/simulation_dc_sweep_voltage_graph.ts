import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_dc_sweep_unit,
  type SimulationDcSweepUnit,
} from "./simulation_units"

export interface SimulationDcSweepVoltageGraph {
  type: "simulation_dc_sweep_voltage_graph"
  simulation_dc_sweep_voltage_graph_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_point_id?: string
  simulation_voltage_probe_id: string
  sweep_values: number[]
  sweep_unit: SimulationDcSweepUnit
  voltage_levels: number[]
  name?: string
  color?: string
}

export const simulation_dc_sweep_voltage_graph = z
  .object({
    type: z.literal("simulation_dc_sweep_voltage_graph"),
    simulation_dc_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
      "simulation_dc_sweep_voltage_graph",
    ),
    simulation_experiment_id: z.string(),
    simulation_parameter_sweep_point_id: z.string().optional(),
    simulation_voltage_probe_id: z.string(),
    sweep_values: z.array(z.number()),
    sweep_unit: simulation_dc_sweep_unit,
    voltage_levels: z.array(z.number()),
    name: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (graph) => graph.sweep_values.length === graph.voltage_levels.length,
    {
      message: "sweep_values and voltage_levels must have the same length",
    },
  )

export type SimulationDcSweepVoltageGraphInput = z.input<
  typeof simulation_dc_sweep_voltage_graph
>
type InferredSimulationDcSweepVoltageGraph = z.infer<
  typeof simulation_dc_sweep_voltage_graph
>

expectTypesMatch<
  SimulationDcSweepVoltageGraph,
  InferredSimulationDcSweepVoltageGraph
>(true)
