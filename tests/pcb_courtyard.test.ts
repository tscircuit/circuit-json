import { expect, test } from "bun:test"
import { pcb_courtyard_rect } from "../src/pcb/pcb_courtyard_rect"
import { pcb_courtyard_outline } from "../src/pcb/pcb_courtyard_outline"
import { pcb_courtyard_polygon } from "../src/pcb/pcb_courtyard_polygon"
import { pcb_courtyard_pill } from "../src/pcb/pcb_courtyard_pill"

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
  })

  expect(outline.layer).toBe("top")
  expect(outline.outline).toHaveLength(3)
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

test("parse courtyard pill", () => {
  const pill = pcb_courtyard_pill.parse({
    type: "pcb_courtyard_pill",
    pcb_component_id: "pcb_component_4",
    center: { x: 2, y: 3 },
    width: 4,
    height: 1.5,
    radius: 0.75,
    layer: "bottom",
  })

  expect(pill.layer).toBe("bottom")
  expect(pill.center).toEqual({ x: 2, y: 3 })
  expect(pill.width).toBe(4)
  expect(pill.height).toBe(1.5)
  expect(pill.radius).toBe(0.75)
})
