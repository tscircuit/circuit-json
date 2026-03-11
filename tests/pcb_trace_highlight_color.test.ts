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

test("pcb_trace.route points support copper pour metadata", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    route: [
      {
        route_type: "wire",
        x: 0,
        y: 0,
        width: 0.2,
        layer: "top",
        copper_pour_id: "pcb_copper_pour_1",
        is_inside_copper_pour: true,
      },
      {
        route_type: "via",
        x: 1,
        y: 1,
        from_layer: "top",
        to_layer: "bottom",
        copper_pour_id: "pcb_copper_pour_2",
        is_inside_copper_pour: false,
      },
    ],
  })

  expect(trace.route[0]?.copper_pour_id).toBe("pcb_copper_pour_1")
  expect(trace.route[0]?.is_inside_copper_pour).toBe(true)
  expect(trace.route[1]?.copper_pour_id).toBe("pcb_copper_pour_2")
  expect(trace.route[1]?.is_inside_copper_pour).toBe(false)
})
