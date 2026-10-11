import { expect, test } from "bun:test"
import { source_trace } from "../src/source/source_trace"

test("trace length provenance and scoped endpoints survive schema parsing", () => {
  const base = {
    type: "source_trace",
    source_trace_id: "t",
    connected_source_port_ids: ["cap"],
    connected_source_net_ids: ["ground"],
    max_length: 5,
  }
  const scoped = {
    ...base,
    max_length_constraint: {
      origin: "decoupling",
      source_port_ids: ["cap", "ic_ground"],
    },
  }
  expect(source_trace.parse(scoped)).toEqual(scoped)
  expect(source_trace.parse(base)).toEqual(base)
  expect(
    source_trace.parse({
      ...base,
      max_length_constraint: { origin: "explicit" },
    }).max_length_constraint,
  ).toEqual({ origin: "explicit" })
  expect(
    source_trace.safeParse({
      ...scoped,
      max_length_constraint: { origin: "decoupling", source_port_ids: ["cap"] },
    }).success,
  ).toBe(false)
})
