import { expect, test } from "bun:test"
import {
  simulation_voltage_probe,
  type SimulationVoltageProbe,
  type SimulationVoltageProbeInput,
} from "../src/simulation/simulation_voltage_probe"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_voltage_probe (single-ended) parses with port id", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_port_id: "port1",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.signal_input_source_port_id).toBe("port1")
  expect(probe.reference_input_source_port_id).toBeUndefined()
  expect(probe.signal_input_source_net_id).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe (single-ended) parses with net id", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_net_id: "net1",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.signal_input_source_net_id).toBe("net1")
  expect(probe.signal_input_source_port_id).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe with no connection ids should throw", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
  }
  expect(() => simulation_voltage_probe.parse(input)).toThrow()
})

test("simulation_voltage_probe (differential) parses with port ids", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_port_id: "port1",
    reference_input_source_port_id: "port2",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.signal_input_source_port_id).toEqual("port1")
  expect(probe.reference_input_source_port_id).toEqual("port2")
  expect(probe.signal_input_source_net_id).toBeUndefined()
  expect(probe.reference_input_source_net_id).toBeUndefined()
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe (differential) parses with net ids", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_net_id: "net1",
    reference_input_source_net_id: "net2",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.signal_input_source_net_id).toEqual("net1")
  expect(probe.reference_input_source_net_id).toEqual("net2")
  expect(probe.simulation_voltage_probe_id).toBeString()

  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe parses with name", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_net_id: "net1",
    name: "My Probe",
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.signal_input_source_net_id).toBe("net1")
  expect(probe.name).toBe("My Probe")
})

test("simulation_voltage_probe parses with scope display fields", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_net_id: "net1",
    name: "VOUT_PROBE",
    color: "#315cff",
    display_name: "VO",
    display_center_value: 3.3,
    display_center_offset_divs: 3,
    volts_per_div: 0.05,
  }

  const result = simulation_voltage_probe.parse(input)
  const probe = result as SimulationVoltageProbe

  expect(probe.display_name).toBe("VO")
  expect(probe.display_center_value).toBe(3.3)
  expect(probe.display_center_offset_divs).toBe(3)
  expect(probe.volts_per_div).toBe(0.05)
  expect(probe.color).toBe("#315cff")
  expect(() => any_circuit_element.parse(input)).not.toThrow()
})

test("simulation_voltage_probe (differential) with mixed connections should throw", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_port_id: "port1",
    reference_input_source_net_id: "net1",
  }
  expect(() => simulation_voltage_probe.parse(input)).toThrow()
})

test("simulation_voltage_probe (single-ended) with both port and net should throw", () => {
  const input: SimulationVoltageProbeInput = {
    type: "simulation_voltage_probe",
    signal_input_source_port_id: "port1",
    signal_input_source_net_id: "net1",
  }
  expect(() => simulation_voltage_probe.parse(input)).toThrow()
})
