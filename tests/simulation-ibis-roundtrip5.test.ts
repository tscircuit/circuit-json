import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
test("experiments retain their subcircuit and requested simulation engine", () => {
  const record = {
    type: "simulation_experiment",
    name: "Transient analysis",
    experiment_type: "spice_transient_analysis",
    subcircuit_id: "subcircuit_1",
    spice_engine: "ngspice",
  }
  const parsed = any_circuit_element.parse(record)
  expect(parsed).toMatchObject(record)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    parsed,
  )
})
