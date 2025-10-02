import { expect, test } from "bun:test"
import { schematic_trace } from "../src/schematic/schematic_trace"

test("schematic_trace.source_trace_id is optional", () => {
  const trace = schematic_trace.parse({
    type: "schematic_trace",
    schematic_trace_id: "trace1",
    junctions: [{ x: 0, y: 0 }],
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
      },
    ],
  })
  expect(trace.source_trace_id).toBeUndefined()
})

test("schematic_trace.subcircuit_connectivity_map_key is optional", () => {
  const trace = schematic_trace.parse({
    type: "schematic_trace",
    schematic_trace_id: "trace2",
    subcircuit_connectivity_map_key: "sub1",
    junctions: [{ x: 0, y: 0 }],
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
      },
    ],
  })
  expect(trace.subcircuit_connectivity_map_key).toBe("sub1")
})
