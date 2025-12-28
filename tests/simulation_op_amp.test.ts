import { test, expect } from "bun:test"
import { simulation_op_amp } from "../src/simulation/simulation_op_amp"
import { any_circuit_element } from "src/any_circuit_element"

test("simulation_op_amp parses", () => {
  const opAmpData = {
    type: "simulation_op_amp" as const,
    source_component_id: "source_opamp_1",
    inverting_input_source_port_id: "port_1",
    non_inverting_input_source_port_id: "port_2",
    output_source_port_id: "port_3",
    positive_supply_source_port_id: "port_4",
    negative_supply_source_port_id: "port_5",
  }

  const parsed = simulation_op_amp.parse(opAmpData)

  expect(parsed.type).toBe("simulation_op_amp")
  expect(parsed.simulation_op_amp_id).toBeString()
  expect(parsed.source_component_id).toBe("source_opamp_1")
  expect(parsed.inverting_input_source_port_id).toBe("port_1")
  expect(parsed.non_inverting_input_source_port_id).toBe("port_2")
  expect(parsed.output_source_port_id).toBe("port_3")
  expect(parsed.positive_supply_source_port_id).toBe("port_4")
  expect(parsed.negative_supply_source_port_id).toBe("port_5")
})

test("any_circuit_element includes simulation_op_amp", () => {
  const opAmpData = {
    type: "simulation_op_amp" as const,
    inverting_input_source_port_id: "port_1",
    non_inverting_input_source_port_id: "port_2",
    output_source_port_id: "port_3",
    positive_supply_source_port_id: "port_4",
    negative_supply_source_port_id: "port_5",
  }

  expect(() => any_circuit_element.parse(opAmpData)).not.toThrow()
  const parsed = any_circuit_element.parse(opAmpData)
  expect(parsed.type).toBe("simulation_op_amp")
})
