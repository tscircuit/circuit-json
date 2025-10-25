import { test, expect } from "bun:test"
import { unknown_parts_engine_error } from "../src"

test("unknown_parts_engine_error parses", () => {
  const error = unknown_parts_engine_error.parse({
    type: "unknown_parts_engine_error",
    message: "Failed to fetch supplier part numbers: Received HTML response",
    source_component_id: "source_component_1",
  })

  expect(error.type).toBe("unknown_parts_engine_error")
  expect(error.error_type).toBe("unknown_parts_engine_error")
  expect(error.message).toContain("HTML response")
  expect(error.source_component_id).toBe("source_component_1")
  expect(error.unknown_parts_engine_error_id).toBeDefined()
})

test("unknown_parts_engine_error with subcircuit_id", () => {
  const error = unknown_parts_engine_error.parse({
    type: "unknown_parts_engine_error",
    message: "Network error occurred",
    source_component_id: "source_component_1",
    subcircuit_id: "subcircuit_1",
  })

  expect(error.subcircuit_id).toBe("subcircuit_1")
})
