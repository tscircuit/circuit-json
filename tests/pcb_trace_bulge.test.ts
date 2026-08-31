import { expect, test } from "bun:test"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("preserves curvature on a PCB trace segment", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    route: [
      {
        route_type: "wire",
        x: 0,
        y: 0,
        bulge: Math.SQRT2 - 1,
        width: 0.2,
        layer: "top",
      },
      {
        route_type: "wire",
        x: 1,
        y: 1,
        width: 0.2,
        layer: "top",
      },
    ],
  })

  const firstRoutePoint = trace.route[0]
  expect(firstRoutePoint?.route_type).toBe("wire")
  if (firstRoutePoint?.route_type !== "wire") return
  expect(firstRoutePoint.bulge).toBe(Math.SQRT2 - 1)
})

test("rejects non-finite PCB trace bulges", () => {
  expect(() =>
    pcb_trace.parse({
      type: "pcb_trace",
      route: [
        {
          route_type: "wire",
          x: 0,
          y: 0,
          bulge: Number.POSITIVE_INFINITY,
          width: 0.2,
          layer: "top",
        },
      ],
    }),
  ).toThrow()
})
