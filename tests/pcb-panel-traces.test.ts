import { expect, test } from "bun:test"
import { pcb_trace, pcb_via } from "../src"

test("panel ownership survives parsing traces and physical vias", () => {
  const route = [
    { route_type: "wire", x: -5, y: 0, width: 0.2, layer: "top" },
    { route_type: "via", x: 0, y: 0, from_layer: "top", to_layer: "bottom" },
    { route_type: "wire", x: 5, y: 0, width: 0.2, layer: "bottom" },
  ]
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    pcb_panel_id: "pcb_panel_0",
    source_trace_id: "source_trace_0",
    route,
  })
  const via = pcb_via.parse({
    type: "pcb_via",
    pcb_panel_id: "pcb_panel_0",
    pcb_trace_id: trace.pcb_trace_id,
    x: 0,
    y: 0,
    layers: ["top", "bottom"],
  })
  expect(trace.pcb_panel_id).toBe("pcb_panel_0")
  expect(via.pcb_panel_id).toBe(trace.pcb_panel_id)
  expect(via.pcb_trace_id).toBe(trace.pcb_trace_id)
  expect(
    pcb_trace.parse({ type: "pcb_trace", route }).pcb_panel_id,
  ).toBeUndefined()
  expect(
    pcb_via.parse({ type: "pcb_via", x: 0, y: 0, layers: ["top", "bottom"] })
      .pcb_panel_id,
  ).toBeUndefined()
})
