import { expect, test } from "bun:test"
import { schematic_trace } from "../src/schematic/schematic_trace"

test("schematic traces preserve wire and junction colors", () => {
  const trace = schematic_trace.parse({
    type: "schematic_trace",
    schematic_trace_id: "schematic_trace_1",
    color: "#000080",
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
      },
    ],
    junctions: [{ x: 1, y: 0, color: "#800000" }],
  })

  expect(trace.color).toBe("#000080")
  expect(trace.junctions[0]?.color).toBe("#800000")
})
