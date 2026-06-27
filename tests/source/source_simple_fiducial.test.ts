import { test, expect } from "bun:test"
import { source_simple_fiducial } from "src/source/source_simple_fiducial"

test("source_simple_fiducial schema is defined", () => {
  expect(source_simple_fiducial).toBeDefined()
  expect(typeof source_simple_fiducial).toBe("object")
})
