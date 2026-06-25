import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_trace_preview } from "../src/pcb/pcb_trace_preview"

test("pcb_trace_preview parses autorouting preview routes", () => {
  const preview = pcb_trace_preview.parse({
    type: "pcb_trace_preview",
    source_trace_id: "source_trace_1",
    pcb_trace_id: "pcb_trace_candidate_1",
    highlight_color: "#ff00aa",
    route: [
      {
        route_type: "wire",
        x: "1mm",
        y: "2mm",
        width: "0.15mm",
        layer: "top",
      },
      {
        route_type: "via",
        x: "3mm",
        y: "4mm",
        from_layer: "top",
        to_layer: "bottom",
      },
    ],
  })

  expect(preview.pcb_trace_preview_id).toMatch(/^pcb_trace_preview/)
  expect(preview.route).toEqual([
    {
      route_type: "wire",
      x: 1,
      y: 2,
      width: 0.15,
      layer: "top",
    },
    {
      route_type: "via",
      x: 3,
      y: 4,
      from_layer: "top",
      to_layer: "bottom",
    },
  ])
})

test("any_circuit_element includes pcb_trace_preview", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_trace_preview",
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

  expect(parsed.type).toBe("pcb_trace_preview")
})
