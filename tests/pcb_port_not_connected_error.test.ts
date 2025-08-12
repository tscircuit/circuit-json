import { test, expect } from "bun:test"
import { pcb_port_not_connected_error } from "../src/pcb/pcb_port_not_connected_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_port_not_connected_error parses", () => {
  const error = pcb_port_not_connected_error.parse({
    type: "pcb_port_not_connected_error",
    message: "port not connected",
    pcb_port_ids: [],
    pcb_component_ids: [],
  })
  expect(error.pcb_error_id).toBeDefined()
  expect(error.pcb_error_id.startsWith("pcb_port_not_connected_error")).toBe(
    true,
  )
})

test("any_circuit_element includes pcb_port_not_connected_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_port_not_connected_error",
    message: "port not connected",
    pcb_port_ids: [],
    pcb_component_ids: [],
  })
  expect(parsed.type).toBe("pcb_port_not_connected_error")
})
