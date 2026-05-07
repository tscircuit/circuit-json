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

  expect(trace.route).toEqual([
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
  ])
})

test("pcb_trace.route points support through_pad segments", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    route: [
      {
        route_type: "through_pad",
        start: { x: "1mm", y: "2mm" },
        end: { x: "3mm", y: "4mm" },
        width: "0.2mm",
        start_layer: "top",
        end_layer: "bottom",
        pcb_smtpad_id: "pcb_smtpad_1",
      },
    ],
  })

  expect(trace.route).toEqual([
    {
      route_type: "through_pad",
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
      width: 0.2,
      start_layer: "top",
      end_layer: "bottom",
      pcb_smtpad_id: "pcb_smtpad_1",
    },
  ])
})
