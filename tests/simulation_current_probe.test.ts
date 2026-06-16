import { expect, test } from "bun:test"
import {
  simulation_current_probe,
  type SimulationCurrentProbe,
  type SimulationCurrentProbeInput,
} from "../src/simulation/simulation_current_probe"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_current_probe parses with target source port id", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    target_source_port_id: "port1",
  }

  const result = simulation_current_probe.parse(input)
  const probe = result as SimulationCurrentProbe

  expect(probe.target_source_port_id).toBe("port1")
  expect(probe.simulation_current_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_current_probe with no target source port id should throw", () => {
  const input = {
    type: "simulation_current_probe",
  }

  expect(() => simulation_current_probe.parse(input)).toThrow()
})

test("simulation_current_probe parses with name", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    target_source_port_id: "port1",
    name: "My Probe",
  }

  const result = simulation_current_probe.parse(input)
  const probe = result as SimulationCurrentProbe

  expect(probe.target_source_port_id).toBe("port1")
  expect(probe.name).toBe("My Probe")
})
