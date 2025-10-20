import { expect, test } from "bun:test"
import { pcb_courtyard_rect } from "../src/pcb/pcb_courtyard_rect"
import { pcb_courtyard_outline } from "../src/pcb/pcb_courtyard_outline"
import { pcb_courtyard_polygon } from "../src/pcb/pcb_courtyard_polygon"

test("parse courtyard rect", () => {
  const rect = pcb_courtyard_rect.parse({
    type: "pcb_courtyard_rect",
    pcb_component_id: "pcb_component_1",
    center: { x: 1, y: 2 },
    width: 3,
    height: 4,
    layer: "bottom",
  })

  expect(rect.layer).toBe("bottom")
  expect(rect).not.toHaveProperty("stroke_width")
  expect(rect).not.toHaveProperty("is_filled")
  expect(rect).not.toHaveProperty("has_stroke")
  expect(rect).not.toHaveProperty("is_stroke_dashed")
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

test("parse courtyard polygon", () => {
  const polygon = pcb_courtyard_polygon.parse({
    type: "pcb_courtyard_polygon",
    pcb_component_id: "pcb_component_3",
    layer: "top",
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
  })

  expect(polygon.layer).toBe("top")
  expect(polygon.points).toHaveLength(3)
  expect(polygon).not.toHaveProperty("is_filled")
  expect(polygon).not.toHaveProperty("stroke_width")
  expect(polygon).not.toHaveProperty("has_stroke")
  expect(polygon).not.toHaveProperty("is_stroke_dashed")
})
