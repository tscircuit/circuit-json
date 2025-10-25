import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"

test("any_circuit_element includes unknown_parts_engine_error", () => {
  const parsed = any_circuit_element.parse({
    type: "unknown_parts_engine_error",
    message: "Network error occurred",
    source_component_id: "source_component_1",
    subcircuit_id: "subcircuit_1",
  })
  expect(parsed.type).toBe("unknown_parts_engine_error")
})
