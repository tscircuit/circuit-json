import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  pcb_hole,
  pcb_hole_circle_or_square_shape,
  pcb_hole_circle_shape,
} from "../src/pcb/pcb_hole"

test("transforms legacy pcb_hole hole_shape 'round' to 'circle'", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 1.2,
    x: 2,
    y: 3,
  })

  expect(hole.type).toBe("pcb_hole")
  expect(hole.hole_shape).toBe("circle")
  if (hole.hole_shape === "circle") {
    expect(hole.hole_diameter).toBe(1.2)
  }
  expect(hole.x).toBe(2)
  expect(hole.y).toBe(3)
})

test("pcb_hole_circle_shape and pcb_hole_circle_or_square_shape transform 'round' to 'circle' and default to 'circle'", () => {
  const circleHole = pcb_hole_circle_shape.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 0.8,
    x: 0,
    y: 0,
  })
  expect(circleHole.hole_shape).toBe("circle")

  const defaultHole = pcb_hole_circle_or_square_shape.parse({
    type: "pcb_hole",
    hole_diameter: 1.0,
    x: 1,
    y: 1,
  })
  expect(defaultHole.hole_shape).toBe("circle")

  const anyElementHole = any_circuit_element.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 1.5,
    x: -1,
    y: 4,
  })
  expect(anyElementHole.type).toBe("pcb_hole")
  if (anyElementHole.type === "pcb_hole") {
    expect(anyElementHole.hole_shape).toBe("circle")
  }
})
