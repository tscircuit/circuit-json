import { expect, test } from "bun:test"
import {
  simulation_switch,
  type SimulationSwitch,
  type SimulationSwitchInput,
} from "../src/simulation/simulation_switch"

test("simulation_switch parses optional timing fields", () => {
  const input: SimulationSwitchInput = {
    type: "simulation_switch",
    closes_at: "5ms",
    opens_at: "10ms",
    starts_closed: true,
    switching_frequency: "2kHz",
  }

  const result = simulation_switch.parse(input)

  const simSwitch = result as SimulationSwitch
  expect(simSwitch.closes_at).toBeCloseTo(5)
  expect(simSwitch.opens_at).toBeCloseTo(10)
  expect(simSwitch.starts_closed).toBe(true)
  expect(simSwitch.switching_frequency).toBeCloseTo(2000)
  expect(simSwitch.simulation_switch_id).toBeString()
})

test("simulation_switch allows minimal definition", () => {
  const input: SimulationSwitchInput = {
    type: "simulation_switch",
  }

  const result = simulation_switch.parse(input)

  const simSwitch = result as SimulationSwitch
  expect(simSwitch.closes_at).toBeUndefined()
  expect(simSwitch.opens_at).toBeUndefined()
  expect(simSwitch.starts_closed).toBeUndefined()
  expect(simSwitch.switching_frequency).toBeUndefined()
})
