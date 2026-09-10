import { test, expect } from "bun:test"
import { source_net } from "src/source/source_net"

test("source_net schema is defined", () => {
  expect(source_net).toBeDefined()
  expect(typeof source_net).toBe("object")
})
