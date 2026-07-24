import { expect, test } from "bun:test"
import { pcb_silkscreen_rect } from "../src/pcb/pcb_silkscreen_rect"
import { pcb_silkscreen_text } from "../src/pcb/pcb_silkscreen_text"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("pcb_silkscreen_text leaves optional defaults absent", () => {
  const text = pcb_silkscreen_text.parse({
    type: "pcb_silkscreen_text",
    pcb_component_id: "pcb_component_1",
    text: "R1",
    layer: "top",
  })

  expect(text).not.toHaveProperty("is_knockout")
  expect(text).not.toHaveProperty("knockout_padding")
  expect(text).not.toHaveProperty("is_mirrored")
})

test("pcb_silkscreen_rect leaves is_filled absent", () => {
  const rect = pcb_silkscreen_rect.parse({
    type: "pcb_silkscreen_rect",
    pcb_component_id: "pcb_component_1",
    center: { x: 0, y: 0 },
    width: 2,
    height: 1,
    layer: "top",
  })

  expect(rect).not.toHaveProperty("is_filled")
})

test("pcb_trace leaves route_thickness_mode absent", () => {
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    route: [],
  })

  expect(trace).not.toHaveProperty("route_thickness_mode")
})
