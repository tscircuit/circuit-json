import { test, expect } from "bun:test"
import { source_trace_not_connected_error } from "src/source/source_trace_not_connected_error"

test("source_trace_not_connected_error schema is defined", () => {
  expect(source_trace_not_connected_error).toBeDefined()
  expect(typeof source_trace_not_connected_error).toBe("object")
})
