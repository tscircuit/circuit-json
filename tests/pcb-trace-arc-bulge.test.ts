import { expect, test } from "bun:test"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("preserves circular arc bulges on PCB trace routes", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    pcb_trace_id: "pcb_trace_arc",
    route: [
      {
        route_type: "wire",
        x: 0,
        y: 0,
        bulge: Math.tan(Math.PI / 8),
        width: 0.2,
        layer: "top",
      },
      {
        route_type: "wire",
        x: 2,
        y: 2,
        width: 0.2,
        layer: "top",
      },
    ],
  })
  const arcStart = trace.route[0]

  expect(arcStart?.route_type).toBe("wire")
  if (!arcStart || arcStart.route_type !== "wire") {
    throw new Error("Expected the trace to start with a wire route point")
  }
  expect(arcStart.bulge).toBeCloseTo(Math.tan(Math.PI / 8))
})
