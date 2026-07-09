import { test, expect } from "bun:test"
import { source_port } from "src/source/source_port"

test("source_port schema is defined", () => {
  expect(source_port).toBeDefined()
  expect(typeof source_port).toBe("object")
})
