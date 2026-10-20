import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
test("experiments retain their subcircuit and requested simulation engine", () => {
  const record = {
    type: "simulation_experiment",
    name: "SI",
    experiment_type: "spice_transient_analysis",
    subcircuit_id: "subcircuit_1",
    spice_engine: "pcb_spice",
  }
  expect(any_circuit_element.parse(record)).toMatchObject(record)
})
