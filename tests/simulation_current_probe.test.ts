import { expect, test } from "bun:test"
import {
  simulation_current_probe,
  type SimulationCurrentProbe,
  type SimulationCurrentProbeInput,
} from "../src/simulation/simulation_current_probe"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_current_probe parses with port ids", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    positive_source_port_id: "port1",
    negative_source_port_id: "port2",
  }

  const result = simulation_current_probe.parse(input)
  const probe = result as SimulationCurrentProbe

  expect(probe.positive_source_port_id).toBe("port1")
  expect(probe.negative_source_port_id).toBe("port2")
  expect(probe.positive_source_net_id).toBeUndefined()
  expect(probe.negative_source_net_id).toBeUndefined()
  expect(probe.simulation_current_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_current_probe parses with net ids", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    positive_source_net_id: "net1",
    negative_source_net_id: "net2",
  }

  const result = simulation_current_probe.parse(input)
  const probe = result as SimulationCurrentProbe

  expect(probe.positive_source_net_id).toBe("net1")
  expect(probe.negative_source_net_id).toBe("net2")
  expect(probe.positive_source_port_id).toBeUndefined()
  expect(probe.negative_source_port_id).toBeUndefined()
  expect(probe.simulation_current_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_current_probe with no connection ids should throw", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
  }

  expect(() => simulation_current_probe.parse(input)).toThrow()
})

test("simulation_current_probe with one port id should throw", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    positive_source_port_id: "port1",
  }

  expect(() => simulation_current_probe.parse(input)).toThrow()
})

test("simulation_current_probe parses with name and scope display fields", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    positive_source_net_id: "net1",
    negative_source_net_id: "net2",
    name: "My Current Probe",
    color: "#ff8c00",
    display_name: "IO",
    display_center_value: 0.01,
    display_center_offset_divs: 2,
    amps_per_div: 0.001,
  }

  const result = simulation_current_probe.parse(input)
  const probe = result as SimulationCurrentProbe

  expect(probe.positive_source_net_id).toBe("net1")
  expect(probe.negative_source_net_id).toBe("net2")
  expect(probe.name).toBe("My Current Probe")
  expect(probe.display_name).toBe("IO")
  expect(probe.display_center_value).toBe(0.01)
  expect(probe.display_center_offset_divs).toBe(2)
  expect(probe.amps_per_div).toBe(0.001)
  expect(probe.color).toBe("#ff8c00")
  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_current_probe with mixed connections should throw", () => {
  const input: SimulationCurrentProbeInput = {
    type: "simulation_current_probe",
    positive_source_port_id: "port1",
    negative_source_net_id: "net1",
  }

  expect(() => simulation_current_probe.parse(input)).toThrow()
})
