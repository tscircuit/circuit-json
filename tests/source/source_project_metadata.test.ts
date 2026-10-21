import { test, expect } from "bun:test"
import { source_project_metadata } from "src/source/source_project_metadata"

test("source_project_metadata schema is defined", () => {
  expect(source_project_metadata).toBeDefined()
  expect(typeof source_project_metadata).toBe("object")
})
