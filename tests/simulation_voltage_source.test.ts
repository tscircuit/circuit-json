import { test, expect } from "bun:test"
import {
  simulation_voltage_source,
  type SimulationAcVoltageSource,
  type SimulationAcVoltageSourceInput,
  type SimulationDcVoltageSource,
} from "../src/simulation/simulation_voltage_source"

test("simulation_voltage_source DC parse with string voltage", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    voltage: "5V",
  })
  expect(source.type).toBe("simulation_voltage_source")
  expect((source as SimulationDcVoltageSource).voltage).toBe(5)
  expect(source.simulation_voltage_source_id).toBeString()
  expect((source as SimulationDcVoltageSource).is_dc_source).toBe(true)
})

test("simulation_voltage_source DC parse with is_dc_source: true", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    is_dc_source: true,
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    voltage: 3.3,
  })
  expect((source as SimulationDcVoltageSource).voltage).toBe(3.3)
  expect((source as SimulationDcVoltageSource).is_dc_source).toBe(true)
})

test("simulation_voltage_source AC parse", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    is_dc_source: false,
    terminal1_source_port_id: "p1",
    terminal1_source_net_id: "net1",
    terminal2_source_port_id: "p2",
    terminal2_source_net_id: "net2",
    voltage: "5V",
    frequency: "60Hz",
    wave_shape: "sinewave",
  })
  expect(source.type).toBe("simulation_voltage_source")
  const acSource = source as SimulationAcVoltageSource
  expect(acSource.is_dc_source).toBe(false)
  expect(acSource.voltage).toBe(5)
  expect(acSource.frequency).toBe(60)
  expect(acSource.wave_shape).toBe("sinewave")
  expect(acSource.simulation_voltage_source_id).toBeString()
})

test("simulation_voltage_source DC parse with optional port/net ids", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    is_dc_source: true,
    voltage: 3.3,
  })
  const dcSource = source as SimulationDcVoltageSource
  expect(dcSource.voltage).toBe(3.3)
  expect(dcSource.is_dc_source).toBe(true)
  expect(dcSource.positive_source_port_id).toBeUndefined()
  expect(dcSource.positive_source_net_id).toBeUndefined()
  expect(dcSource.negative_source_port_id).toBeUndefined()
  expect(dcSource.negative_source_net_id).toBeUndefined()
})

test("simulation_voltage_source AC with duty_cycle", () => {
  const source_obj: SimulationAcVoltageSourceInput = {
    type: "simulation_voltage_source",
    is_dc_source: false,
    voltage: "5V",
    frequency: "60Hz",
    wave_shape: "square",
    duty_cycle: "50%",
  }
  const source = simulation_voltage_source.parse(source_obj)
  const acSource = source as SimulationAcVoltageSource
  expect(acSource.duty_cycle).toBe(0.5)

  const source2_obj: SimulationAcVoltageSourceInput = {
    type: "simulation_voltage_source",
    is_dc_source: false,
    voltage: "5V",
    frequency: "60Hz",
    wave_shape: "square",
    duty_cycle: 0.25,
  }
  const source2 = simulation_voltage_source.parse(source2_obj)
  const acSource2 = source2 as SimulationAcVoltageSource
  expect(acSource2.duty_cycle).toBe(0.25)
})
