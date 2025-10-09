import { expect, test } from "bun:test"
import { pcb_fabrication_note_rect } from "../src/pcb/pcb_fabrication_note_rect"

test("parse fabrication note rect with defaults", () => {
  const rect = pcb_fabrication_note_rect.parse({
    type: "pcb_fabrication_note_rect",
    pcb_component_id: "pcb_component_1",
    center: { x: 0, y: 0 },
    width: "10mm",
    height: "5mm",
    layer: "top",
    is_filled: true,
    has_stroke: false,
  })

  expect(rect.layer).toBe("top")
  expect(rect.stroke_width).toBeCloseTo(0.1)
  expect(rect.is_filled).toBe(true)
  expect(rect.has_stroke).toBe(false)
})
