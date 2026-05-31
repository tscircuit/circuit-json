import { expect, test } from "bun:test"
import { pcb_fabrication_note_text } from "../src/pcb/pcb_fabrication_note_text"

test("parse fabrication note text with ccw_rotation", () => {
  const note = pcb_fabrication_note_text.parse({
    type: "pcb_fabrication_note_text",
    pcb_component_id: "pcb_component_1",
    text: "Pin 1 marker",
    layer: "top",
    ccw_rotation: 45,
  })

  expect(note.font).toBe("tscircuit2024")
  expect(note.font_size).toBeCloseTo(1)
  expect(note.anchor_position).toEqual({ x: 0, y: 0 })
  expect(note.ccw_rotation).toBe(45)
})
