import { expect, test } from "bun:test"
import { pcb_trace, type PcbTraceInput } from "../src/pcb/pcb_trace"
import { pcb_via } from "../src/pcb/pcb_via"

test("trace route vias preserve a standalone via reference when provided", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    pcb_via_id: "pcb_via_1",
    pcb_trace_id: "pcb_trace_1",
    x: 0,
    y: 0,
    layers: ["top", "bottom"],
  })
  const input = {
    type: "pcb_trace",
    pcb_trace_id: via.pcb_trace_id,
    route: [
      {
        route_type: "via",
        pcb_via_id: via.pcb_via_id,
        x: via.x,
        y: via.y,
        from_layer: "top",
        to_layer: "bottom",
      },
      {
        route_type: "via",
        x: 1,
        y: 0,
        from_layer: "bottom",
        to_layer: "top",
      },
    ],
  } satisfies PcbTraceInput

  expect(pcb_trace.parse(input).route).toStrictEqual(input.route)
})
