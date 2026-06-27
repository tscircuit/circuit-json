import { test, expect } from "bun:test"
import { source_simple_op_amp } from "src/source/source_simple_op_amp"

test("source_simple_op_amp schema is defined", () => {
  expect(source_simple_op_amp).toBeDefined()
  expect(typeof source_simple_op_amp).toBe("object")
})
