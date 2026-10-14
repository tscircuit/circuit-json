import { test, expect } from "bun:test"
import { source_trace } from "src/source/source_trace"

test("source_trace schema is defined", () => {
  expect(source_trace).toBeDefined()
  expect(typeof source_trace).toBe("object")
})

test("source_trace has required fields", () => {
  expect(source_trace.shape).toBeDefined()
})
