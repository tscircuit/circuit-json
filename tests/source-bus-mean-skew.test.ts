import { expect, test } from "bun:test"
import { source_bus } from "../src"

test("source_bus preserves an explicit mean skew reference", () => {
  const bus = {
    type: "source_bus" as const,
    source_bus_id: "bus_1",
    source_trace_ids: ["a", "b"],
    max_length_skew: 0.25,
  }
  expect(source_bus.parse(bus)).toEqual(bus)
  expect(source_bus.parse({ ...bus, length_skew_reference: "mean" })).toEqual({
    ...bus,
    length_skew_reference: "mean",
  })
  expect(
    source_bus.safeParse({ ...bus, length_skew_reference: "invalid" }).success,
  ).toBe(false)
})
