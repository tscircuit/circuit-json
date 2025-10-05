import { expect, test } from "bun:test"
import {
  experiment_type,
  simulation_experiment,
} from "../src/simulation/simulation_experiment"
import { simulation_transient_voltage_graph } from "../src/simulation/simulation_transient_voltage_graph"

test("simulation_experiment requires valid experiment_type", () => {
  const parsed = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "Transient analysis",
    experiment_type: "spice_transient_analysis",
  })

  expect(parsed.simulation_experiment_id).toBeString()
  expect(parsed.experiment_type).toBe("spice_transient_analysis")
  expect(() => experiment_type.parse("spice_ac_analysis")).not.toThrow()
})

test("simulation_transient_voltage_graph parses required data", () => {
  const graph = simulation_transient_voltage_graph.parse({
    type: "simulation_transient_voltage_graph",
    simulation_experiment_id: "simulation_experiment_123",
    voltage_levels: [0, 1, 0.5],
    time_per_step: "0.1ms",
    start_time_ms: "0ms",
    end_time_ms: "2ms",
    name: "Output voltage",
  })

  expect(graph.simulation_transient_voltage_graph_id).toBeString()
  expect(graph.simulation_experiment_id).toBe("simulation_experiment_123")
  expect(graph.voltage_levels).toEqual([0, 1, 0.5])
  expect(graph.timestamps_ms).toBeUndefined()
  expect(graph.time_per_step).toBe(0.1)
  expect(graph.start_time_ms).toBe(0)
  expect(graph.end_time_ms).toBe(2)
})
