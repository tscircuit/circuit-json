import { test, expect } from "bun:test"
import { duration, timestamp } from "src/units"

test("duration and timestamp parse various time units", () => {
  // Test seconds
  expect(duration.parse("1s")).toBeCloseTo(1000)
  expect(timestamp.parse("1s")).toBeCloseTo(1000)

  // Test milliseconds
  expect(duration.parse("500ms")).toBeCloseTo(500)
  expect(timestamp.parse("500ms")).toBeCloseTo(500)

  // Test microseconds
  expect(duration.parse("250us")).toBeCloseTo(0.25)
  expect(timestamp.parse("250us")).toBeCloseTo(0.25)
  expect(duration.parse("250µs")).toBeCloseTo(0.25)
  expect(timestamp.parse("250µs")).toBeCloseTo(0.25)

  // Test nanoseconds
  expect(duration.parse("100ns")).toBeCloseTo(0.0001)
  expect(timestamp.parse("100ns")).toBeCloseTo(0.0001)

  // Test picoseconds
  expect(duration.parse("75ps")).toBeCloseTo(0.000000075)
  expect(timestamp.parse("75ps")).toBeCloseTo(0.000000075)

  // Test femtoseconds
  expect(duration.parse("50fs")).toBeCloseTo(0.00000000005)
  expect(timestamp.parse("50fs")).toBeCloseTo(0.00000000005)
})
