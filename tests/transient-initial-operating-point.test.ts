import { expect, test } from "bun:test"
import { simulation_experiment } from "../src"

test("serializes a transient initial operating-point request", () => {
  const experiment = simulation_experiment.parse({
    type: "simulation_experiment",
    simulation_experiment_id: "simulation_experiment_0",
    name: "5-V RC steady state",
    experiment_type: "spice_transient_analysis",
    calculate_initial_operating_point: true,
  })

  expect(experiment).toMatchInlineSnapshot(`
    {
      "experiment_type": "spice_transient_analysis",
      "name": "5-V RC steady state",
      "simulation_experiment_id": "simulation_experiment_0",
      "type": "simulation_experiment",
    }
  `)
})
