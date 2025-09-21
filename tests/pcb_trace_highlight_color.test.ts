import { expect, test } from "bun:test"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("pcb_trace.highlight_color defaults to undefined", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    route: [
      {
        route_type: "wire",
        x: 0,
        y: 0,
        width: 0.2,
        layer: "top",
      },
    ],
  })

  expect(trace.highlight_color).toBeUndefined()
})

test("pcb_trace.highlight_color can be specified", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    highlight_color: "#00ffcc",
    route: [
      {
        route_type: "wire",
        x: 1,
        y: 1,
        width: 0.3,
        layer: "bottom",
      },
    ],
  })

  expect(trace.highlight_color).toBe("#00ffcc")
})
