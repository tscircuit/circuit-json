import { test, expect } from "bun:test"
import { source_simple_inductor } from "src/source/source_simple_inductor"

test("source_simple_inductor schema is defined", () => {
  expect(source_simple_inductor).toBeDefined()
  expect(typeof source_simple_inductor).toBe("object")
})
