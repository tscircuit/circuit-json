import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { pcb_hole, type PcbHoleCircleOrSquare } from "../src/pcb/pcb_hole"

// Circuit JSON written before `pcb_hole.hole_shape` "round" was renamed to
// "circle" must still parse, normalized to the new name.
test("legacy hole_shape round parses as circle", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 1.2,
    x: 3,
    y: 4,
  }) as PcbHoleCircleOrSquare

  expect(hole.type).toBe("pcb_hole")
  expect(hole.hole_shape).toBe("circle")
  expect(hole.hole_diameter).toBe(1.2)
  expect(hole.x).toBe(3)
  expect(hole.y).toBe(4)
})

test("legacy hole_shape round parses through any_circuit_element", () => {
  const hole = any_circuit_element.parse({
    type: "pcb_hole",
    hole_shape: "round",
    hole_diameter: 0.8,
    x: 0,
    y: 0,
  })

  expect(hole.type).toBe("pcb_hole")
  expect((hole as PcbHoleCircleOrSquare).hole_shape).toBe("circle")
})
