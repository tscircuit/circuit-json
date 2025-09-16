import { expect, test } from "bun:test"
import {
  pcb_plated_hole,
  type PcbHolePillWithRectPad,
} from "../src/pcb/pcb_plated_hole"

test("parse pill hole with rect pad defaults hole offset to 0", () => {
  const hole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "pill_hole_with_rect_pad",
    hole_shape: "pill",
    pad_shape: "rect",
    hole_width: 1,
    hole_height: 2,
    rect_pad_width: 3,
    rect_pad_height: 4,
    x: 0,
    y: 0,
    layers: ["top"],
  }) as PcbHolePillWithRectPad

  expect(hole.hole_offset_x).toBe(0)
  expect(hole.hole_offset_y).toBe(0)
})

test("parse pill hole with rect pad and offsets", () => {
  const hole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "pill_hole_with_rect_pad",
    hole_shape: "pill",
    pad_shape: "rect",
    hole_width: 1,
    hole_height: 2,
    rect_pad_width: 3,
    rect_pad_height: 4,
    hole_offset_x: 0.5,
    hole_offset_y: -0.25,
    x: 0,
    y: 0,
    layers: ["top"],
  }) as PcbHolePillWithRectPad

  expect(hole.hole_offset_x).toBe(0.5)
  expect(hole.hole_offset_y).toBe(-0.25)
})
