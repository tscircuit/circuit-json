import { expect, test } from "bun:test"
import { source_trace } from "../src/source/source_trace"

const sourceTraceInput = {
  type: "source_trace" as const,
  source_trace_id: "source_trace_0",
  connected_source_port_ids: ["source_port_0", "source_port_1"],
  connected_source_net_ids: [],
}

test("source_trace accepts a nonnegative maximum via count", () => {
  const trace = source_trace.parse({
    ...sourceTraceInput,
    max_via_count: 0,
  })

  expect(trace.max_via_count).toBe(0)
})

test("source_trace rejects a negative maximum via count", () => {
  expect(() =>
    source_trace.parse({
      ...sourceTraceInput,
      max_via_count: -1,
    }),
  ).toThrow()
})
