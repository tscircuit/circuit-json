import { test, expect } from "bun:test"
import {
  simulation_current_source,
  type SimulationAcCurrentSource,
  type SimulationAcCurrentSourceInput,
  type SimulationDcCurrentSource,
} from "../src/simulation/simulation_current_source"
import { any_circuit_element } from "../src/any_circuit_element"

test("simulation_current_source DC parse with string current", () => {
  const source = simulation_current_source.parse({
    type: "simulation_current_source",
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    current: "1A",
  })
  expect(source.type).toBe("simulation_current_source")
  expect((source as SimulationDcCurrentSource).current).toBe(1)
  expect(source.simulation_current_source_id).toBeString()
  expect((source as SimulationDcCurrentSource).is_dc_source).toBe(true)
  expect(() => any_circuit_element.parse(source)).not.toThrow()
})

test("simulation_current_source DC parse with is_dc_source: true", () => {
  const source = simulation_current_source.parse({
    type: "simulation_current_source",
    is_dc_source: true,
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    current: 0.5,
  })
  expect((source as SimulationDcCurrentSource).current).toBe(0.5)
  expect((source as SimulationDcCurrentSource).is_dc_source).toBe(true)
})

test("simulation_current_source AC parse", () => {
  const source_obj = {
    type: "simulation_current_source" as const,
    is_dc_source: false,
    terminal1_source_port_id: "p1",
    terminal1_source_net_id: "net1",
    terminal2_source_port_id: "p2",
    terminal2_source_net_id: "net2",
    current: "1A",
    frequency: "60Hz",
    wave_shape: "sinewave",
  }
  const source = simulation_current_source.parse(source_obj)
  expect(source.type).toBe("simulation_current_source")
  const acSource = source as SimulationAcCurrentSource
  expect(acSource.is_dc_source).toBe(false)
  expect(acSource.current).toBe(1)
  expect(acSource.frequency).toBe(60)
  expect(acSource.wave_shape).toBe("sinewave")
  expect(acSource.simulation_current_source_id).toBeString()
  expect(() => any_circuit_element.parse(source_obj)).not.toThrow()
})

test("simulation_current_source DC parse with optional port/net ids", () => {
  const source = simulation_current_source.parse({
    type: "simulation_current_source",
    is_dc_source: true,
    current: 0.1,
  })
  const dcSource = source as SimulationDcCurrentSource
  expect(dcSource.current).toBe(0.1)
  expect(dcSource.is_dc_source).toBe(true)
  expect(dcSource.positive_source_port_id).toBeUndefined()
  expect(dcSource.positive_source_net_id).toBeUndefined()
  expect(dcSource.negative_source_port_id).toBeUndefined()
  expect(dcSource.negative_source_net_id).toBeUndefined()
})

test("simulation_current_source AC with duty_cycle", () => {
  const source_obj: SimulationAcCurrentSourceInput = {
    type: "simulation_current_source",
    is_dc_source: false,
    current: "1A",
    frequency: "60Hz",
    wave_shape: "square",
    duty_cycle: "50%",
  }
  const source = simulation_current_source.parse(source_obj)
  const acSource = source as SimulationAcCurrentSource
  expect(acSource.duty_cycle).toBe(0.5)

  const source2_obj: SimulationAcCurrentSourceInput = {
    type: "simulation_current_source",
    is_dc_source: false,
    current: "1A",
    frequency: "60Hz",
    wave_shape: "square",
    duty_cycle: 0.25,
  }
  const source2 = simulation_current_source.parse(source2_obj)
  const acSource2 = source2 as SimulationAcCurrentSource
  expect(acSource2.duty_cycle).toBe(0.25)
})
