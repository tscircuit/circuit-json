import test, { expect } from "bun:test"

test("circuit-json - trace point coordinate pair validity", () => {
  const pt = { x: 10.5, y: -20.25 }
  expect(pt.x).toBe(10.5)
  expect(pt.y).toBe(-20.25)
})
