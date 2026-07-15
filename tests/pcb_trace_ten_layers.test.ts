import { expect, test } from "bun:test"
import { pcbRenderLayer } from "../src/common/PcbRenderLayer"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("supports traces and render layers on ten-layer boards", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    pcb_trace_id: "pcb_trace_ten_layers",
    route: [
      {
        route_type: "wire",
        x: 0,
        y: 0,
        width: 0.1,
        layer: "inner7",
      },
      {
        route_type: "via",
        x: 1,
        y: 0,
        from_layer: "inner7",
        to_layer: "inner8",
      },
      {
        route_type: "wire",
        x: 1,
        y: 1,
        width: 0.1,
        layer: "inner8",
      },
    ],
  })

  expect(trace.route.map((routePoint) => routePoint.route_type)).toEqual([
    "wire",
    "via",
    "wire",
  ])
  expect(pcbRenderLayer.parse("inner7_copper")).toBe("inner7_copper")
  expect(pcbRenderLayer.parse("inner8_copper")).toBe("inner8_copper")
})
