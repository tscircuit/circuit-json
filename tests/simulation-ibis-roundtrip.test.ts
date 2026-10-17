import { expect, test } from "bun:test"
import { any_circuit_element, type CircuitJson } from "../src"
import { model, stimulus, eye } from "./fixtures/simulation-ibis"

test("the public Circuit JSON union retains IBIS declarations, timing and probe associations", () => {
  const circuit: CircuitJson = [
    model,
    stimulus,
    eye,
    {
      type: "simulation_ibis_pin_state",
      simulation_experiment_id: "experiment",
      source_port_id: "source_port_tx",
      mode: "output",
      enabled: true,
    },
  ].map((record) => any_circuit_element.parse(record))
  expect(circuit[0]).toMatchObject(model)
  expect(
    circuit.find((record) => record.type === "simulation_digital_stimulus")!
      .unit_interval_ms,
  ).toBeCloseTo(0.0000025, 14)
  expect(
    circuit.find((record) => record.type === "simulation_eye_diagram")!
      .time_origin_ms,
  ).toBeCloseTo(0.00000125, 14)
  expect(circuit[2]).toMatchObject({ simulation_voltage_probe_id: "probe_rx" })
  const experiment = any_circuit_element.parse({
    type: "simulation_experiment",
    name: "SI",
    experiment_type: "spice_transient_analysis",
    subcircuit_id: "subcircuit_1",
    execution_mode: "external",
    spice_engine: "ngspice",
  })
  expect(experiment).toMatchObject({
    execution_mode: "external",
    spice_engine: "ngspice",
    subcircuit_id: "subcircuit_1",
  })
  const graph = any_circuit_element.parse({
    type: "simulation_transient_voltage_graph",
    simulation_experiment_id: "experiment",
    simulation_voltage_probe_id: "probe_rx",
    voltage_levels: [0, 1],
    timestamps_ms: [0, 1],
    time_per_step: 1,
    start_time_ms: 0,
    end_time_ms: 1,
  })
  expect(graph).toMatchObject({
    simulation_voltage_probe_id: "probe_rx",
    timestamps_ms: [0, 1],
  })
})
