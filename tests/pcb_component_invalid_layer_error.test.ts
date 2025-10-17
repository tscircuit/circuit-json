import { test, expect } from "bun:test"
import { pcb_component_invalid_layer_error } from "../src/pcb/pcb_component_invalid_layer_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_component_invalid_layer_error parses", () => {
  const error = pcb_component_invalid_layer_error.parse({
    type: "pcb_component_invalid_layer_error",
    message: 'Component "R1" cannot be placed on layer "inner1"',
    source_component_id: "source_component_1",
    layer: "inner1",
  })

  expect(error.type).toBe("pcb_component_invalid_layer_error")
  expect(error.error_type).toBe("pcb_component_invalid_layer_error")
  expect(error.layer).toBe("inner1")
  expect(error.source_component_id).toBe("source_component_1")
})

test("any_circuit_element includes pcb_component_invalid_layer_error", () => {
  const error = any_circuit_element.parse({
    type: "pcb_component_invalid_layer_error",
    message: 'Component "R1" cannot be placed on layer "inner2"',
    source_component_id: "source_component_2",
    layer: "inner2",
    subcircuit_id: "subcircuit_1",
  })

  expect(error.type).toBe("pcb_component_invalid_layer_error")
})
