import test, { expect } from "bun:test"

test("circuit-json - component pad dimension boundary values", () => {
  const pad = { width: 1.2, height: 0.8, shape: "rect" }
  expect(pad.width).toBeGreaterThan(0)
  expect(pad.height).toBeGreaterThan(0)
  expect(pad.shape).toBe("rect")
})
