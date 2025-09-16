import { expect, test } from "bun:test"
import { schematic_line } from "../src/schematic/schematic_line"
import { schematic_rect } from "../src/schematic/schematic_rect"
import { schematic_circle } from "../src/schematic/schematic_circle"
import { schematic_arc } from "../src/schematic/schematic_arc"

test("schematic_line defaults stroke width and color", () => {
  const line = schematic_line.parse({
    type: "schematic_line",
    schematic_component_id: "comp_1",
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  })

  expect(line.schematic_line_id).toMatch(/^schematic_line_/)
  expect(line.stroke_width).toBeCloseTo(0.02)
  expect(line.color).toBe("#000000")
  expect(line.is_dashed).toBe(false)
})

test("schematic_rect assigns defaults", () => {
  const rect = schematic_rect.parse({
    type: "schematic_rect",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    width: 1,
    height: 2,
  })

  expect(rect.schematic_rect_id).toMatch(/^schematic_rect_/)
  expect(rect.rotation).toBe(0)
  expect(rect.stroke_width).toBeCloseTo(0.02)
  expect(rect.is_filled).toBe(false)
  expect(rect.is_dashed).toBe(false)
})

test("schematic_circle assigns defaults", () => {
  const circle = schematic_circle.parse({
    type: "schematic_circle",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    radius: 1,
  })

  expect(circle.schematic_circle_id).toMatch(/^schematic_circle_/)
  expect(circle.stroke_width).toBeCloseTo(0.02)
  expect(circle.is_filled).toBe(false)
  expect(circle.is_dashed).toBe(false)
})

test("schematic_arc defaults direction and styling", () => {
  const arc = schematic_arc.parse({
    type: "schematic_arc",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    radius: 1,
    start_angle: 0,
    end_angle: 90,
  })

  expect(arc.schematic_arc_id).toMatch(/^schematic_arc_/)
  expect(arc.direction).toBe("counterclockwise")
  expect(arc.stroke_width).toBeCloseTo(0.02)
  expect(arc.is_dashed).toBe(false)
})
