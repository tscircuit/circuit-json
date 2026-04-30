import { test, expect } from "bun:test"
import { source_ambiguous_port_reference } from "src/source/source_ambiguous_port_reference"

test("source_ambiguous_port_reference schema is defined", () => {
  expect(source_ambiguous_port_reference).toBeDefined()
  expect(typeof source_ambiguous_port_reference).toBe("object")
})
