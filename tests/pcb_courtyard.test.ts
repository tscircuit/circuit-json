import { expect, test } from "bun:test"
import { pcb_courtyard_rect } from "../src/pcb/pcb_courtyard_rect"
import { pcb_courtyard_outline } from "../src/pcb/pcb_courtyard_outline"

test("parse courtyard rect", () => {
  const rect = pcb_courtyard_rect.parse({
    type: "pcb_courtyard_rect",
    pcb_component_id: "pcb_component_1",
    center: { x: 1, y: 2 },
    width: 3,
    height: 4,
    layer: "bottom",
    is_filled: false,
    has_stroke: true,
    is_stroke_dashed: true,
  })

  expect(rect.layer).toBe("bottom")
  expect(rect.stroke_width).toBeCloseTo(0.1)
  expect(rect.is_filled).toBe(false)
  expect(rect.has_stroke).toBe(true)
  expect(rect.is_stroke_dashed).toBe(true)
})

test("parse courtyard outline", () => {
  const outline = pcb_courtyard_outline.parse({
    type: "pcb_courtyard_outline",
    pcb_component_id: "pcb_component_2",
    layer: "top",
    outline: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    is_closed: false,
  })

  expect(outline.layer).toBe("top")
  expect(outline.outline).toHaveLength(3)
  expect(outline.is_closed).toBe(false)
})
