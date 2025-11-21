import { test, expect } from "bun:test"
import { source_pin_must_be_connected_error } from "../src/source/source_pin_must_be_connected_error"

test("source_pin_must_be_connected_error with subcircuit_id", () => {
  const validError = {
    type: "source_pin_must_be_connected_error" as const,
    message: "Port GND on U2 must be connected but is floating",
    source_component_id: "source_component_2",
    source_port_id: "source_port_2",
    subcircuit_id: "subcircuit_1",
  }

  const result = source_pin_must_be_connected_error.parse(validError)

  expect(result.type).toBe("source_pin_must_be_connected_error")
  expect(result.error_type).toBe("source_pin_must_be_connected_error")
  expect(result.message).toBe(
    "Port GND on U2 must be connected but is floating",
  )
  expect(result.source_component_id).toBe("source_component_2")
  expect(result.source_port_id).toBe("source_port_2")
  expect(result.subcircuit_id).toBe("subcircuit_1")
  expect(result.source_pin_must_be_connected_error_id).toMatch(
    /^source_pin_must_be_connected_error_/,
  )
})
