import { expect, test } from "bun:test"
import { pcb_hole, type PcbHoleOval } from "../src/pcb/pcb_hole"

test("parse circle hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "circle",
    hole_diameter: 1.5,
    x: 0,
    y: 0,
  })

  expect(hole.hole_shape).toBe("circle")
  expect(hole.hole_diameter).toBe(1.5)
})

test("parse square hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "square",
    hole_diameter: 2.0,
    x: 0,
    y: 0,
  })

  expect(hole.hole_shape).toBe("square")
  expect(hole.hole_diameter).toBe(2.0)
})

test("parse oval hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "oval",
    hole_width: 3.0,
    hole_height: 1.5,
    x: 0,
    y: 0,
  }) as PcbHoleOval

  expect(hole.hole_shape).toBe("oval")
  expect(hole.hole_width).toBe(3.0)
  expect(hole.hole_height).toBe(1.5)
})

test("parse pill hole", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "pill",
    hole_width: 2.5,
    hole_height: 1.0,
    x: 0,
    y: 0,
  }) as PcbHoleOval

  expect(hole.hole_shape).toBe("pill")
  expect(hole.hole_width).toBe(2.5)
  expect(hole.hole_height).toBe(1.0)
})

test("parse pill hole with optional properties", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "pill",
    hole_width: 2.5,
    hole_height: 1.0,
    x: 1.5,
    y: -1.0,
    pcb_group_id: "group_1",
    subcircuit_id: "subcircuit_1",
  }) as PcbHoleOval

  expect(hole.hole_shape).toBe("pill")
  expect(hole.hole_width).toBe(2.5)
  expect(hole.hole_height).toBe(1.0)
  expect(hole.x).toBe(1.5)
  expect(hole.y).toBe(-1.0)
  expect(hole.pcb_group_id).toBe("group_1")
  expect(hole.subcircuit_id).toBe("subcircuit_1")
})