import { test, expect } from "bun:test"
import { simulation_voltage_source } from "../src/simulation/simulation_voltage_source"

test("simulation_voltage_source parse with string voltage", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    voltage: "5V",
  })
  expect(source.type).toBe("simulation_voltage_source")
  expect(source.voltage).toBe(5)
  expect(source.simulation_voltage_source_id).toBeString()
})

test("simulation_voltage_source parse with number voltage", () => {
  const source = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    positive_source_port_id: "p1",
    positive_source_net_id: "net1",
    negative_source_port_id: "p2",
    negative_source_net_id: "net2",
    voltage: 3.3,
  })
  expect(source.voltage).toBe(3.3)
})
