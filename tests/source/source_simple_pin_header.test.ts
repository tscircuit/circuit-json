import { test, expect } from "bun:test"
import { source_simple_pin_header } from "src/source/source_simple_pin_header"

test("source_simple_pin_header schema is defined", () => {
  expect(source_simple_pin_header).toBeDefined()
  expect(typeof source_simple_pin_header).toBe("object")
})

test("source_simple_pin_header has pin_count field", () => {
  expect(source_simple_pin_header.shape.pin_count).toBeDefined()
})

test("source_simple_pin_header has gender field", () => {
  expect(source_simple_pin_header.shape.gender).toBeDefined()
})
