import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
test("transient samples retain their declared voltage probe", () => {
  const record = {
    type: "simulation_transient_voltage_graph",
    simulation_experiment_id: "experiment",
    simulation_voltage_probe_id: "probe_rx",
    voltage_levels: [0, 1],
    timestamps_ms: [0, 1],
    time_per_step: 1,
    start_time_ms: 0,
    end_time_ms: 1,
  }
  expect(any_circuit_element.parse(record)).toMatchObject(record)
})
