import { test, expect } from "bun:test"
import { source_simple_fuse } from "src/source/source_simple_fuse"

test("source_simple_fuse schema is defined", () => {
  expect(source_simple_fuse).toBeDefined()
  expect(typeof source_simple_fuse).toBe("object")
})

test("source_simple_fuse has ftype literal", () => {
  expect(source_simple_fuse.shape.ftype).toBeDefined()
})
