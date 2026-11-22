import { expect, test } from "bun:test"
import {
  any_circuit_element,
  type SimulationPcbTransientChannelSimulation,
  simulation_pcb_transient_channel_simulation,
} from "../src"

test("channel simulations preserve optional aggressor controls", () => {
  const simulation: SimulationPcbTransientChannelSimulation = {
    type: "simulation_pcb_transient_channel_simulation",
    simulation_pcb_transient_channel_simulation_id: "run_1",
    bit_rate_bps: 50e6,
    allow_unrouted_traces: false,
  }
  expect(
    simulation_pcb_transient_channel_simulation.parse(simulation),
  ).toStrictEqual(simulation)
  const declared = {
    ...simulation,
    aggressor_pattern: "prbs15",
    aggressor_disabled: false,
  }
  expect(
    any_circuit_element.parse({ ...declared, aggressor_pattern: " prbs15 " }),
  ).toStrictEqual(declared)
  const disabled = { ...simulation, aggressor_disabled: true }
  expect(any_circuit_element.parse(disabled)).toStrictEqual(disabled)
  expect(
    simulation_pcb_transient_channel_simulation.safeParse({
      ...simulation,
      aggressor_pattern: " ",
    }).success,
  ).toBe(false)
})
