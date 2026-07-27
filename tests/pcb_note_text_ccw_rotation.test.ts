import { expect, test } from "bun:test"
import { pcb_note_text, type PcbNoteText } from "../src/pcb/pcb_note_text"

test("parse pcb_note_text with ccw_rotation", () => {
  const note = pcb_note_text.parse({
    type: "pcb_note_text",
    text: "Hello World",
    anchor_position: { x: 0, y: 0 },
    ccw_rotation: 45,
  }) as PcbNoteText

  expect(note.type).toBe("pcb_note_text")
  expect(note.text).toBe("Hello World")
  expect(note.ccw_rotation).toBe(45)
})

test("parse pcb_note_text with ccw_rotation in degrees string", () => {
  const note = pcb_note_text.parse({
    type: "pcb_note_text",
    text: "Rotated Text",
    anchor_position: { x: 5, y: 10 },
    ccw_rotation: "90deg",
  }) as PcbNoteText

  expect(note.ccw_rotation).toBe(90)
})

test("parse pcb_note_text with default ccw_rotation of 0", () => {
  const note = pcb_note_text.parse({
    type: "pcb_note_text",
    text: "Default rotation",
    anchor_position: { x: 0, y: 0 },
  }) as PcbNoteText

  expect(note.ccw_rotation).toBe(0)
})

test("pcb_note_text accepts negative rotation", () => {
  const note = pcb_note_text.parse({
    type: "pcb_note_text",
    text: "Counter-clockwise",
    anchor_position: { x: 0, y: 0 },
    ccw_rotation: -45,
  }) as PcbNoteText

  expect(note.ccw_rotation).toBe(-45)
})
