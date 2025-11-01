import { test, expect } from "bun:test"
import { simulation_unknown_experiment_error } from "../src/simulation/simulation_unknown_experiment_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_unknown_experiment_error parses", () => {
  const error = simulation_unknown_experiment_error.parse({
    type: "simulation_unknown_experiment_error",
    message: "SPICE simulation failed",
    simulation_experiment_id: "exp_1",
  })
  expect(error.simulation_unknown_experiment_error_id).toBeDefined()
  expect(
    error.simulation_unknown_experiment_error_id.startsWith(
      "simulation_unknown_experiment_error",
    ),
  ).toBe(true)
  expect(error.message).toBe("SPICE simulation failed")
  expect(error.simulation_experiment_id).toBe("exp_1")
})

test("any_circuit_element includes simulation_unknown_experiment_error", () => {
  const parsed = any_circuit_element.parse({
    type: "simulation_unknown_experiment_error",
    message: "SPICE simulation failed",
    simulation_experiment_id: "exp_1",
  })
  expect(parsed.type).toBe("simulation_unknown_experiment_error")
})
