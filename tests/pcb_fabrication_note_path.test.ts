import { expect, test } from "bun:test"
import { pcb_fabrication_note_path } from "../src/pcb/pcb_fabrication_note_path"

const path = {
  type: "pcb_fabrication_note_path",
  pcb_component_id: "component",
  layer: "top",
  route: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  stroke_width: "0mm",
  color: "rgba(255,0,0,0.5)",
}

test("fabrication paths preserve independent fill and stroke flags", () => {
  for (const is_filled of [false, true]) {
    for (const has_stroke of [false, true]) {
      const parsed = pcb_fabrication_note_path.parse({
        ...path,
        is_filled,
        has_stroke,
      })
      expect(parsed.is_filled).toBe(is_filled)
      expect(parsed.has_stroke).toBe(has_stroke)
      expect(parsed.stroke_width).toBe(0)
      expect(parsed.color).toBe(path.color)
      expect(parsed.route).toEqual(path.route)
    }
  }
})

test("legacy fabrication paths retain omitted flags", () => {
  const parsed = pcb_fabrication_note_path.parse(path)
  expect(parsed.is_filled).toBeUndefined()
  expect(parsed.has_stroke).toBeUndefined()
})

test("fabrication fill flags must be booleans", () => {
  for (const flag of ["is_filled", "has_stroke"]) {
    expect(
      pcb_fabrication_note_path.safeParse({ ...path, [flag]: "true" }).success,
    ).toBe(false)
  }
})
