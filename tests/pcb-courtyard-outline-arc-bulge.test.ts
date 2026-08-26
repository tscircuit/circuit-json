import { expect, test } from "bun:test"
import { pcb_courtyard_outline } from "../src/pcb/pcb_courtyard_outline"

test("parses an arc bulge on a PCB courtyard outline", () => {
  const outline = pcb_courtyard_outline.parse({
    type: "pcb_courtyard_outline",
    pcb_courtyard_outline_id: "pcb_courtyard_outline_arc",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    outline: [
      { x: 0, y: 0, bulge: 1 },
      { x: 2, y: 0 },
    ],
  })

  expect(outline.outline[0]?.bulge).toBe(1)
})
