import { test, expect } from "bun:test"
import { source_simple_push_button } from "src/source/source_simple_push_button"

test("source_simple_push_button schema is defined", () => {
  expect(source_simple_push_button).toBeDefined()
  expect(typeof source_simple_push_button).toBe("object")
})
