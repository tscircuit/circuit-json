import { expect, test } from "bun:test"
import { schematic_arc } from "../src/schematic/schematic_arc"
import { schematic_circle } from "../src/schematic/schematic_circle"
import { schematic_line } from "../src/schematic/schematic_line"
import { schematic_path } from "../src/schematic/schematic_path"
import { schematic_rect } from "../src/schematic/schematic_rect"

test("schematic_line defaults stroke width and color", () => {
  const line = schematic_line.parse({
    type: "schematic_line",
    schematic_component_id: "comp_1",
    x1: 0,
    y1: 0,
    x2: 1,
    y2: 1,
  })

  expect(line.schematic_line_id).toMatch(/^schematic_line_/)
  expect(line.color).toBe("#000000")
  expect(line.is_dashed).toBe(false)
  expect(line).not.toHaveProperty("dash_length")
  expect(line).not.toHaveProperty("dash_gap")
})

test("schematic_line accepts dash distance parameters", () => {
  const line = schematic_line.parse({
    type: "schematic_line",
    x1: 0,
    y1: 0,
    x2: 1,
    y2: 1,
    is_dashed: true,
    dash_length: "2mm",
    dash_gap: "1mm",
  })

  expect(line.dash_length).toBe(2)
  expect(line.dash_gap).toBe(1)
})

test("schematic_path accepts dash distance parameters", () => {
  const path = schematic_path.parse({
    type: "schematic_path",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    dash_length: "2mm",
    dash_gap: "1mm",
  })

  expect(path.dash_length).toBe(2)
  expect(path.dash_gap).toBe(1)
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
  expect(rect.is_filled).toBe(false)
  expect(rect.is_dashed).toBe(false)
})

test("schematic_rect accepts corner radius", () => {
  const rect = schematic_rect.parse({
    type: "schematic_rect",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    width: 1,
    height: 2,
    corner_radius: "0.25mm",
  })

  expect(rect.corner_radius).toBe(0.25)
})

test("schematic_circle assigns defaults", () => {
  const circle = schematic_circle.parse({
    type: "schematic_circle",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    radius: 1,
  })

  expect(circle.schematic_circle_id).toMatch(/^schematic_circle_/)
  expect(circle.is_filled).toBe(false)
  expect(circle.is_dashed).toBe(false)
})

test("schematic_arc defaults direction and styling", () => {
  const arc = schematic_arc.parse({
    type: "schematic_arc",
    schematic_component_id: "comp_1",
    center: { x: 0, y: 0 },
    radius: 1,
    start_angle_degrees: 0,
    end_angle_degrees: 90,
  })

  expect(arc.schematic_arc_id).toMatch(/^schematic_arc_/)
  expect(arc.direction).toBe("counterclockwise")
  expect(arc.is_dashed).toBe(false)
})
