import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"

test("any_circuit_element includes unknown_error_finding_part", () => {
  const parsed = any_circuit_element.parse({
    type: "unknown_error_finding_part",
    message: "Network error occurred",
    source_component_id: "source_component_1",
    subcircuit_id: "subcircuit_1",
  })
  expect(parsed.type).toBe("unknown_error_finding_part")
})
