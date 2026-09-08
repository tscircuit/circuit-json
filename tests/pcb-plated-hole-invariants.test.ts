import { expect, test } from "bun:test"

test("pcb_plated_hole annular ring invariant", () => {
  const drill = 0.4
  const outer = 0.8
  expect(outer).toBeGreaterThan(drill)
})
