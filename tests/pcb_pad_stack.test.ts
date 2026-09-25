import { expect, test } from "bun:test"
import { pcb_plated_hole } from "../src/pcb/pcb_plated_hole"
import type { PcbPadStack } from "../src/pcb/properties/pcb_pad_stack"
import { pcb_via } from "../src/pcb/pcb_via"

const padStack: PcbPadStack = [
  { layer: "top", shape: "circle", radius: 2.5 },
  {
    layer: "inner1",
    shape: "rect",
    width: 4.318,
    height: 4.318,
    ccw_rotation: 45,
  },
  {
    layer: "bottom",
    shape: "pill",
    width: 5,
    height: 3,
    radius: 1.5,
  },
]

test("pcb_plated_hole preserves layer-specific pad geometry", () => {
  const platedHole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    pcb_plated_hole_id: "pcb_plated_hole_1",
    shape: "circle",
    outer_diameter: 5,
    hole_diameter: 2,
    x: 10,
    y: 20,
    layers: ["top", "inner1", "bottom"],
    pad_stack: padStack,
  })

  expect(platedHole.pad_stack).toEqual(padStack)
})

test("pcb_via preserves layer-specific pad geometry", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    pcb_via_id: "pcb_via_1",
    x: 10,
    y: 20,
    outer_diameter: 5,
    hole_diameter: 2,
    layers: ["top", "inner1", "bottom"],
    pad_stack: padStack,
  })

  expect(via.pad_stack).toEqual(padStack)
})

test("pad-stack entries require shape-specific dimensions", () => {
  expect(() =>
    pcb_via.parse({
      type: "pcb_via",
      pcb_via_id: "pcb_via_1",
      x: 10,
      y: 20,
      layers: ["top", "bottom"],
      pad_stack: [{ layer: "top", shape: "circle" }],
    }),
  ).toThrow()
})
