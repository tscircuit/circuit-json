import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  pcb_hole,
  pcb_hole_circle_or_square_shape,
  pcb_hole_circle_shape,
  type PcbHole,
} from "../src/pcb/pcb_hole"

test("pcb_hole transforms legacy hole_shape 'round' to 'circle'", () => {
  const input = {
    type: "pcb_hole" as const,
    pcb_hole_id: "pcb_hole_1",
    hole_shape: "round" as const,
    hole_diameter: 1.2,
    x: 2,
    y: -3,
  }

  for (const schema of [
    pcb_hole,
    pcb_hole_circle_shape,
    pcb_hole_circle_or_square_shape,
    any_circuit_element,
  ]) {
    const parsed = schema.parse(input) as PcbHole
    expect(parsed.hole_shape).toBe("circle")
    expect(parsed).toEqual({
      type: "pcb_hole",
      pcb_hole_id: "pcb_hole_1",
      hole_shape: "circle",
      hole_diameter: 1.2,
      x: 2,
      y: -3,
    })
  }
})

test("pcb_hole preserves 'circle' and 'square' hole_shape values", () => {
  const circleHole = pcb_hole.parse({
    type: "pcb_hole",
    pcb_hole_id: "pcb_hole_circle_1",
    hole_shape: "circle",
    hole_diameter: 1,
    x: 0,
    y: 0,
  })
  expect(circleHole.hole_shape).toBe("circle")

  const squareHole = pcb_hole.parse({
    type: "pcb_hole",
    pcb_hole_id: "pcb_hole_square_1",
    hole_shape: "square",
    hole_diameter: 1,
    x: 0,
    y: 0,
  })
  expect(squareHole.hole_shape).toBe("square")
})
