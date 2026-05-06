import { test, expect } from "bun:test"
import { source_pin_missing_trace_warning } from "src/source/source_pin_missing_trace_warning"

test("source_pin_missing_trace_warning schema is defined", () => {
  expect(source_pin_missing_trace_warning).toBeDefined()
  expect(typeof source_pin_missing_trace_warning).toBe("object")
})
