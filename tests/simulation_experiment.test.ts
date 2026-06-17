import { expect, test } from "bun:test"
import {
  experiment_type,
  simulation_experiment,
} from "../src/simulation/simulation_experiment"
import { simulation_transient_voltage_graph } from "../src/simulation/simulation_transient_voltage_graph"
import { simulation_transient_current_graph } from "../src/simulation/simulation_transient_current_graph"
import { any_circuit_element } from "../src/any_circuit_element"

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

test("simulation_experiment parses start time and spice options", () => {
  const parsed = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "TPS63802 Figure 10-17 transient",
    experiment_type: "spice_transient_analysis",
    time_per_step: "5ns",
    start_time_ms: "697.58us",
    end_time_ms: "715.56us",
    spice_options: {
      method: "gear",
      reltol: 0.01,
      abstol: "1n",
      vntol: "1u",
    },
  })

  expect(parsed.time_per_step).toBeCloseTo(0.000005)
  expect(parsed.start_time_ms).toBeCloseTo(0.69758)
  expect(parsed.end_time_ms).toBeCloseTo(0.71556)
  expect(parsed.spice_options).toEqual({
    method: "gear",
    reltol: 0.01,
    abstol: "1n",
    vntol: "1u",
  })
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
  expect(() => any_circuit_element.parse(graph)).not.toThrow()
})

test("simulation_transient_current_graph parses required data", () => {
  const graph = simulation_transient_current_graph.parse({
    type: "simulation_transient_current_graph",
    simulation_experiment_id: "simulation_experiment_123",
    current_levels: [0, 0.01, 0.005],
    time_per_step: "0.1ms",
    start_time_ms: "0ms",
    end_time_ms: "2ms",
    name: "Output current",
  })

  expect(graph.simulation_transient_current_graph_id).toBeString()
  expect(graph.simulation_experiment_id).toBe("simulation_experiment_123")
  expect(graph.current_levels).toEqual([0, 0.01, 0.005])
  expect(graph.timestamps_ms).toBeUndefined()
  expect(graph.time_per_step).toBe(0.1)
  expect(graph.start_time_ms).toBe(0)
  expect(graph.end_time_ms).toBe(2)
})
