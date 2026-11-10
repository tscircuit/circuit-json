import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_bus,
  type SourceBus,
  type SourceDifferentialPairBus,
} from "../src"

const pair = {
  type: "source_bus",
  source_bus_id: "usb",
  source_trace_ids: ["dp1", "dp2", "dm1"],
  max_length_skew: 0.1,
  differential_pair: {
    positive_source_trace_ids: ["dp1", "dp2"],
    negative_source_trace_ids: ["dm1"],
  },
}

test("ordered multi-hop lanes round-trip through the public element schema", () => {
  expect(source_bus.parse(pair)).toEqual(JSON.parse(JSON.stringify(pair)))
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(pair)))).toEqual(
    JSON.parse(JSON.stringify(pair)),
  )
})

// Exercise both the old singular representation and the decided ordered lanes.
// The old schema accepts the invalid singular states instead of validating them.
for (const differential_pair of [
  { positive_source_trace_id: "dp1", negative_source_trace_id: "dm1" },
  pair.differential_pair,
]) {
  test("pair membership must equal the ordered lane concatenation", () => {
    expect(
      source_bus.safeParse({
        ...pair,
        source_trace_ids: ["unrelated"],
        differential_pair,
      }).success,
    ).toBe(false)
  })

  test.each([
    { length_match_source_trace_ids: ["other"] },
    { min_length: 1 },
    { max_length: 10 },
    { target_length: 5 },
    { length_tolerance: 0.1 },
    { pcb_trace_spacing: 0.2 },
    { pcb_spacing_to_other_signals: 0.4 },
    { target_impedance: 50 },
    { target_impedance_min: 40 },
    { target_impedance_max: 60 },
    { target_differential_impedance: 90 },
    { target_differential_impedance_min: 80 },
    { target_differential_impedance_max: 100 },
    { trace_gap: 0.1 },
    { max_uncoupled_length: 1 },
  ])("pair rejects ordinary-bus or unsupported intent: %j", (fields) => {
    expect(
      source_bus.safeParse({ ...pair, differential_pair, ...fields }).success,
    ).toBe(false)
  })
}

test.each([
  { positive_source_trace_id: "dp1", negative_source_trace_id: "dp1" },
  { positive_source_trace_id: "", negative_source_trace_id: "dm1" },
  {
    positive_source_trace_id: "dp1",
    negative_source_trace_id: "dm1",
    trace_gap: 0.1,
  },
  {
    positive_source_trace_id: "dp1",
    negative_source_trace_id: "dm1",
    max_uncoupled_length: 1,
  },
])("rejects invalid legacy pair lanes: %j", (differential_pair) => {
  expect(source_bus.safeParse({ ...pair, differential_pair }).success).toBe(
    false,
  )
})

test.each([
  { positive_source_trace_ids: [], negative_source_trace_ids: ["dm1"] },
  { positive_source_trace_ids: ["dp1"], negative_source_trace_ids: [] },
  { positive_source_trace_ids: [""], negative_source_trace_ids: ["dm1"] },
  { positive_source_trace_ids: ["dp1"], negative_source_trace_ids: [" "] },
  {
    positive_source_trace_ids: ["dp1", "dp1"],
    negative_source_trace_ids: ["dm1"],
  },
  {
    positive_source_trace_ids: ["dp1"],
    negative_source_trace_ids: ["dm1", "dm1"],
  },
  { positive_source_trace_ids: ["dp1"], negative_source_trace_ids: ["dp1"] },
])(
  "rejects invalid ordered lanes even when membership matches: %j",
  (differential_pair) => {
    expect(
      source_bus.safeParse({
        ...pair,
        differential_pair,
        source_trace_ids: [
          ...differential_pair.positive_source_trace_ids,
          ...differential_pair.negative_source_trace_ids,
        ],
      }).success,
    ).toBe(false)
  },
)

test("pair membership cannot omit, add, duplicate, or reorder hops", () => {
  for (const source_trace_ids of [
    [],
    ["dp1", "dm1"],
    ["dp1", "dp2", "dm1", "extra"],
    ["dp2", "dp1", "dm1"],
    ["dp1", "dp1", "dm1"],
  ]) {
    expect(source_bus.safeParse({ ...pair, source_trace_ids }).success).toBe(
      false,
    )
    expect(
      any_circuit_element.safeParse({ ...pair, source_trace_ids }).success,
    ).toBe(false)
  }
})

test("pair skew is explicit, finite, nonnegative, and zero is valid", () => {
  for (const max_length_skew of [
    undefined,
    -1,
    Infinity,
    -Infinity,
    NaN,
    "0.1mm",
  ]) {
    expect(source_bus.safeParse({ ...pair, max_length_skew }).success).toBe(
      false,
    )
  }
  expect(
    source_bus.parse({ ...pair, max_length_skew: 0 }).max_length_skew,
  ).toBe(0)
})

test("strict pair metadata rejects singular IDs, gap, and unknown nested keys", () => {
  for (const fields of [
    { positive_source_trace_id: "dp1" },
    { negative_source_trace_id: "dm1" },
    { trace_gap: 0.1 },
    { max_uncoupled_length: 1 },
    { target_differential_impedance: 90 },
    { unknown: true },
  ]) {
    expect(
      source_bus.safeParse({
        ...pair,
        differential_pair: { ...pair.differential_pair, ...fields },
      }).success,
    ).toBe(false)
  }
})

test("ordinary buses retain their constraints and reject differential intent", () => {
  const ordinary = {
    type: "source_bus",
    source_bus_id: "data",
    source_trace_ids: ["dq0", "dq1"],
    target_length: 10,
    length_tolerance: 0.1,
  }
  expect(source_bus.parse(ordinary)).toEqual(
    JSON.parse(JSON.stringify(ordinary)),
  )
  for (const fields of [
    { differential_pair: {} },
    { target_differential_impedance: 90 },
    { target_differential_impedance_min: 80 },
    { target_differential_impedance_max: 100 },
  ]) {
    expect(
      any_circuit_element.safeParse({ ...ordinary, ...fields }).success,
    ).toBe(false)
  }
})

test("public pair types exclude ordinary constraints even through variables", () => {
  const typedPair: SourceDifferentialPairBus = {
    type: "source_bus",
    source_bus_id: "usb",
    source_trace_ids: ["dp1", "dm1"],
    max_length_skew: 0,
    differential_pair: {
      positive_source_trace_ids: ["dp1"],
      negative_source_trace_ids: ["dm1"],
    },
  }
  const mixed = { ...typedPair, min_length: 1 }
  // @ts-expect-error Ordinary length constraints cannot be attached to a pair.
  const invalid: SourceBus = mixed
  expect(source_bus.safeParse(invalid).success).toBe(false)
})
