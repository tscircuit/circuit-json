import { test, expect } from "bun:test"
import { source_pin_must_be_connected_error } from "src/source/source_pin_must_be_connected_error"

test("source_pin_must_be_connected_error schema is defined", () => {
  expect(source_pin_must_be_connected_error).toBeDefined()
  expect(typeof source_pin_must_be_connected_error).toBe("object")
})
