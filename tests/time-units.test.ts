import { test, expect } from "bun:test"
import { duration_ms, ms } from "src/units"

test("duration_ms and ms parse various time units", () => {
  // Test seconds
  expect(duration_ms.parse("1s")).toBeCloseTo(1000)
  expect(ms.parse("1s")).toBeCloseTo(1000)

  // Test milliseconds
  expect(duration_ms.parse("500ms")).toBeCloseTo(500)
  expect(ms.parse("500ms")).toBeCloseTo(500)

  // Test microseconds
  expect(duration_ms.parse("250us")).toBeCloseTo(0.25)
  expect(ms.parse("250us")).toBeCloseTo(0.25)
  expect(duration_ms.parse("250µs")).toBeCloseTo(0.25)
  expect(ms.parse("250µs")).toBeCloseTo(0.25)

  // Test nanoseconds
  expect(duration_ms.parse("100ns")).toBeCloseTo(0.0001)
  expect(ms.parse("100ns")).toBeCloseTo(0.0001)

  // Test picoseconds
  expect(duration_ms.parse("75ps")).toBeCloseTo(0.000000075)
  expect(ms.parse("75ps")).toBeCloseTo(0.000000075)

  // Test femtoseconds
  expect(duration_ms.parse("50fs")).toBeCloseTo(0.00000000005)
  expect(ms.parse("50fs")).toBeCloseTo(0.00000000005)
})
