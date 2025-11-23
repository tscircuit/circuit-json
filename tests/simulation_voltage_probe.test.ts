import { expect, test } from "bun:test"
import {
  simulation_voltage_probe,
  type SimulationVoltageProbe,
  type SimulationVoltageProbeInput,
} from "../src/simulation/simulation_voltage_probe"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_voltage_probe parses with port ids", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    source_port_ids: ["port1"],
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.source_port_ids).toEqual(["port1"])
  expect(probe.source_net_ids).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe parses with net ids", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    source_net_ids: ["net1"],
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.source_net_ids).toEqual(["net1"])
  expect(probe.source_port_ids).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe with no connection ids should throw", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
  }
  expect(() => simulation_voltage_probe.parse(input)).toThrow()
})

test("simulation_voltage_probe parses with differential port ids", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    source_port_ids: ["port1", "port2"],
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.source_port_ids).toEqual(["port1", "port2"])
  expect(probe.source_net_ids).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe parses with name", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    source_net_ids: ["net1"],
    name: "My Probe",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.source_net_ids).toEqual(["net1"])
  expect(probe.name).toBe("My Probe")
})

test("simulation_voltage_probe with both connection ids should throw", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    source_port_ids: ["port1"],
    source_net_ids: ["net1"],
  }
  expect(() => simulation_voltage_probe.parse(input)).toThrow()
})
