import { expect, test } from "bun:test"
import { simulation_parameter_sweep } from "../src/simulation"

test("simulation_parameter_sweep accepts aligned display coordinates", () => {
  const parameterSweep = simulation_parameter_sweep.parse({
    type: "simulation_parameter_sweep",
    simulation_experiment_id: "simulation_experiment_0",
    parameter_type: "resistance",
    resistor_source_component_id: "source_component_feedback",
    parameter_values: [236_600, 511_000, 855_400],
    parameter_unit: "Ω",
    display_parameter_values: [1.8, 3.3, 5.2],
    display_parameter_unit: "V",
  })

  expect(parameterSweep.display_parameter_values).toEqual([1.8, 3.3, 5.2])
})

test("simulation_parameter_sweep rejects incomplete display coordinates", () => {
  expect(() =>
    simulation_parameter_sweep.parse({
      type: "simulation_parameter_sweep",
      simulation_experiment_id: "simulation_experiment_0",
      parameter_type: "resistance",
      resistor_source_component_id: "source_component_feedback",
      parameter_values: [236_600, 511_000],
      parameter_unit: "Ω",
      display_parameter_values: [1.8],
      display_parameter_unit: "V",
    }),
  ).toThrow(
    "display_parameter_values and parameter_values must have the same length",
  )
})
