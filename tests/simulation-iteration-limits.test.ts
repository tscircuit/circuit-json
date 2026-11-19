import { expect, test } from "bun:test"
import { simulation_experiment } from "../src/simulation/simulation_experiment"

test("TI iteration limits survive simulation experiment parsing", () => {
  const parsed = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "TI transient profile",
    experiment_type: "spice_transient_analysis",
    spice_options: {
      method: "trap",
      abstol: "10n",
      vntol: "10u",
      itl1: 1500,
      itl2: 400,
      itl4: 400,
    },
  })

  expect({
    spice_options: parsed.spice_options,
    invalidCountsAccepted: ["itl1", "itl2", "itl4"].map((name) => ({
      name,
      accepted: [0, -1, 1.5, "400"].map(
        (count) =>
          simulation_experiment.safeParse({
            type: "simulation_experiment",
            name: "TI profile",
            experiment_type: "spice_transient_analysis",
            spice_options: { [name]: count },
          }).success,
      ),
    })),
  }).toMatchSnapshot()
})
