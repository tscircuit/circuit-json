import { test, expect } from "bun:test"
import { source_trace } from "../src/source/source_trace"

test("source_trace.routing_phase_index accepts a number", () => {
  const trace = source_trace.parse({
    type: "source_trace",
    source_trace_id: "trace1",
    connected_source_port_ids: ["source_port_1", "source_port_2"],
    connected_source_net_ids: ["source_net_1"],
    routing_phase_index: 1,
  })

  expect(trace.routing_phase_index).toBe(1)
})

test("source_trace.routing_phase_index accepts null", () => {
  const trace = source_trace.parse({
    type: "source_trace",
    source_trace_id: "trace1",
    connected_source_port_ids: ["source_port_1", "source_port_2"],
    connected_source_net_ids: ["source_net_1"],
    routing_phase_index: null,
  })

  expect(trace.routing_phase_index).toBeNull()
})
