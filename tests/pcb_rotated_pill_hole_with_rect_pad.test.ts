import { expect, test } from "bun:test"
import {
  type PcbHoleRotatedPillWithRectPad,
  pcb_plated_hole,
} from "../src/pcb/pcb_plated_hole"

test("parse rotated pill hole with rect pad", () => {
  const hole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "rotated_pill_hole_with_rect_pad",
    hole_shape: "rotated_pill",
    pad_shape: "rect",
    hole_width: 1,
    hole_height: 2,
    hole_ccw_rotation: 45,
    rect_pad_width: 3,
    rect_pad_height: 4,
    rect_border_radius: 0.1,
    rect_ccw_rotation: 45,
    x: 0,
    y: 0,
    layers: ["top"],
  })
  expect(hole.shape).toBe("rotated_pill_hole_with_rect_pad")
  expect((hole as PcbHoleRotatedPillWithRectPad).hole_ccw_rotation).toBe(45)
  expect((hole as PcbHoleRotatedPillWithRectPad).rect_border_radius).toBe(0.1)
  expect((hole as PcbHoleRotatedPillWithRectPad).hole_offset_x).toBe(0)
  expect((hole as PcbHoleRotatedPillWithRectPad).hole_offset_y).toBe(0)
})

test("parse rotated pill hole with rect pad and offsets", () => {
  const hole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "rotated_pill_hole_with_rect_pad",
    hole_shape: "rotated_pill",
    pad_shape: "rect",
    hole_width: 1,
    hole_height: 2,
    hole_ccw_rotation: 45,
    rect_pad_width: 3,
    rect_pad_height: 4,
    rect_border_radius: 0.1,
    rect_ccw_rotation: 45,
    hole_offset_x: 0.2,
    hole_offset_y: -0.3,
    x: 0,
    y: 0,
    layers: ["top"],
  }) as PcbHoleRotatedPillWithRectPad

  expect(hole.hole_offset_x).toBe(0.2)
  expect(hole.hole_offset_y).toBe(-0.3)
})
