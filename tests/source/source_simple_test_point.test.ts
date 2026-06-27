import { test, expect } from "bun:test"
import { source_simple_test_point } from "src/source/source_simple_test_point"

test("source_simple_test_point schema is defined", () => {
  expect(source_simple_test_point).toBeDefined()
  expect(typeof source_simple_test_point).toBe("object")
})
