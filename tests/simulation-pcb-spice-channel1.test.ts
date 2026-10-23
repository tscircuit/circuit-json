import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { simulation_experiment } from "../src/simulation/simulation_experiment"
import { experiment } from "./fixtures/simulation-pcb-spice-channel"

test("pcb_spice channel settings survive Circuit JSON parsing and serialization", () => {
  const parsed = simulation_experiment.parse(experiment)
  expect(parsed).toEqual(experiment)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    experiment,
  )
  expect(
    simulation_experiment.parse({
      ...experiment,
      pcb_spice_channel: undefined,
    }),
  ).toHaveProperty("pcb_spice_channel", undefined)
})
