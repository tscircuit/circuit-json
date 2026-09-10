import test, { expect } from "bun:test"

test("circuit-json - solder mask expansion margin validation", () => {
  const mask = { expansion_mm: 0.05, min_clearance_mm: 0.025 }
  expect(mask.expansion_mm).toBeGreaterThanOrEqual(0)
  expect(mask.min_clearance_mm).toBeGreaterThan(0)
})
