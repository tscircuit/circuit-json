import { expect, test } from "bun:test"
import { pcb_hole, type PcbHoleCircle } from "../src/pcb/pcb_hole"

test("pcb_hole preserves an optional name", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "circle",
    hole_diameter: 3.2,
    x: -15,
    y: 0,
    name: "H9",
  }) as PcbHoleCircle

  expect(hole.name).toBe("H9")
})

test("pcb_hole name is optional", () => {
  const hole = pcb_hole.parse({
    type: "pcb_hole",
    hole_shape: "circle",
    hole_diameter: 3.2,
    x: 0,
    y: 0,
  }) as PcbHoleCircle

  expect(hole.name).toBeUndefined()
})
