import { test, expect } from "bun:test"
import { source_simple_transistor } from "src/source/source_simple_transistor"

test("source_simple_transistor schema is defined", () => {
  expect(source_simple_transistor).toBeDefined()
  expect(typeof source_simple_transistor).toBe("object")
})

test("source_simple_transistor has ftype literal", () => {
  expect(source_simple_transistor.shape.ftype).toBeDefined()
})
