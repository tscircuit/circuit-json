import { expect, test } from "bun:test"
import {
  pcb_hole,
  type PcbHolePill,
  type PcbHoleRotatedPill,
} from "../src/pcb/pcb_hole"

test("parse pill-shaped non-plated hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "pill",
    hole_width: 1.5,
    hole_height: 0.8,
    x: 5,
    y: 10,
  }) as PcbHolePill

  expect(hole.type).toBe("pcb_hole")
  expect(hole.hole_shape).toBe("pill")
  expect(hole.hole_width).toBe(1.5)
  expect(hole.hole_height).toBe(0.8)
  expect(hole.x).toBe(5)
  expect(hole.y).toBe(10)
})

test("parse rotated pill-shaped non-plated hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "rotated_pill",
    hole_width: 1.5,
    hole_height: 0.8,
    x: 5,
    y: 10,
    ccw_rotation: 45,
  }) as PcbHoleRotatedPill

  expect(hole.type).toBe("pcb_hole")
  expect(hole.hole_shape).toBe("rotated_pill")
  expect(hole.hole_width).toBe(1.5)
  expect(hole.hole_height).toBe(0.8)
  expect(hole.x).toBe(5)
  expect(hole.y).toBe(10)
  expect(hole.ccw_rotation).toBe(45)
})
