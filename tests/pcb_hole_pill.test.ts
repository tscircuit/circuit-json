import { expect, test } from "bun:test"
import {
  pcb_hole,
  pcb_hole_circle_or_square,
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

test("pcb_hole_circle_or_square accepts 'circle' shape", () => {
  const hole = pcb_hole_circle_or_square.parse({
    type: "pcb_hole",
    hole_shape: "circle",
    hole_diameter: 1,
    x: 0,
    y: 0,
  })
  expect(hole.hole_shape).toBe("circle")
})

test("pcb_hole_circle_or_square accepts 'square' shape", () => {
  const hole = pcb_hole_circle_or_square.parse({
    type: "pcb_hole",
    hole_shape: "square",
    hole_diameter: 1,
    x: 0,
    y: 0,
  })
  expect(hole.hole_shape).toBe("square")
})

test("pcb_hole_circle_or_square transforms 'round' to 'circle'", () => {
  const hole = pcb_hole_circle_or_square.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 1,
    x: 0,
    y: 0,
  })
  expect(hole.hole_shape).toBe("circle")
})
