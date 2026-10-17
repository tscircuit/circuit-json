import { expect, test } from "bun:test"
import { any_circuit_element, type CircuitJson } from "../src"

const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  source: {
    url: "https://example.com/chip.zip",
    sha256: "a".repeat(64),
    archive: { member: "chip.ibs", member_sha256: "b".repeat(64) },
  },
  component: "CHIP",
  pin_to_source_port_map: { A1: "source_port_tx" },
  model_selections: { A1: "OUTPUT" },
  corner: "typical",
  package_policy: "omit",
}
const stimulus = {
  type: "simulation_digital_stimulus",
  name: "DATA",
  simulation_experiment_id: "experiment",
  source_port_id: "source_port_tx",
  unit_interval_ms: "2.5ns",
  start_time_ms: "0ns",
  initial_state: 0,
  inverted: false,
  pattern: { type: "bits", bits: "00010111", repeat: true },
}
const eye = {
  type: "simulation_eye_diagram",
  name: "RX_EYE",
  simulation_experiment_id: "experiment",
  simulation_voltage_probe_id: "probe_rx",
  unit_interval_ms: "2.5ns",
  time_origin_ms: "1.25ns",
  start_time_ms: "40ns",
  end_time_ms: "160ns",
}

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

test("IBIS sources are exclusive and remote sources require byte hashes", () => {
  for (const source of [
    { url: "https://example.com/chip.ibs" },
    { file: "chip.ibs", content: "[IBIS Ver] 4.2" },
    { ...model.source, sha256: "invalid" },
    { ...model.source, archive: { member: "" } },
  ]) {
    expect(any_circuit_element.safeParse({ ...model, source }).success).toBe(
      false,
    )
  }
  expect(
    any_circuit_element.safeParse({ ...model, source: { file: "chip.ibs" } })
      .success,
  ).toBe(true)
  expect(
    any_circuit_element.safeParse({ ...model, pin_to_source_port_map: {} })
      .success,
  ).toBe(false)
  expect(
    any_circuit_element.safeParse({ ...model, corner: undefined }).success,
  ).toBe(false)
})

test("invalid digital timing, nonbinary traffic, pin states and eye gates are rejected", () => {
  for (const change of [
    { unit_interval_ms: 0 },
    { unit_interval_ms: Infinity },
    { start_time_ms: -1 },
    { pattern: { type: "bits", bits: "012", repeat: true } },
    { pattern: { type: "bits", bits: "", repeat: true } },
  ]) {
    expect(
      any_circuit_element.safeParse({ ...stimulus, ...change }).success,
    ).toBe(false)
  }
  for (const state of [{ mode: "output" }, { mode: "input", enabled: false }]) {
    expect(
      any_circuit_element.safeParse({
        type: "simulation_ibis_pin_state",
        simulation_experiment_id: "experiment",
        source_port_id: "port",
        ...state,
      }).success,
    ).toBe(false)
  }
  for (const change of [
    { unit_interval_ms: -1 },
    { time_origin_ms: Infinity },
    { start_time_ms: "200ns" },
    { end_time_ms: 0 },
  ]) {
    expect(any_circuit_element.safeParse({ ...eye, ...change }).success).toBe(
      false,
    )
  }
})
