import { expect, test } from "bun:test"
import { simulation_experiment } from "../src"

test("preserves the request to calculate a transient's initial operating point", () => {
  const experiment = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "5-V RC steady state",
    experiment_type: "spice_transient_analysis",
    calculate_initial_operating_point: true,
  })

  expect(experiment).toHaveProperty("calculate_initial_operating_point", true)
})
