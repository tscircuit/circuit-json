import { expect, test } from "bun:test"
import { simulation_experiment } from "../src/simulation/simulation_experiment"
import { channel, experiment } from "./fixtures/simulation-pcb-spice-channel"

test("pcb_spice channel validates section counts, lane counts and filament refinement", () => {
  for (const sections of [0, 129, 1.5]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, sections },
      }),
    ).toThrow()
  }
  for (const lanes of [[], Array(4).fill(channel.lanes[0])]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, lanes },
      }),
    ).toThrow()
  }
  for (const extraction of [
    { ...channel.extraction, filaments: 0 },
    { ...channel.extraction, refinement_filaments: 2 },
    { ...channel.extraction, refinement_filaments: 1.5 },
  ]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, extraction },
      }),
    ).toThrow()
  }
})
