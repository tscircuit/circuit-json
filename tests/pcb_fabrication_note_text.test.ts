import { expect, test } from "bun:test"
import { pcb_fabrication_note_text } from "../src"

test("preserves fabrication-note text visibility and mirroring", () => {
  const fabricationNoteText = pcb_fabrication_note_text.parse({
    type: "pcb_fabrication_note_text",
    pcb_fabrication_note_text_id: "pcb_fabrication_note_text_0",
    pcb_component_id: "pcb_component_0",
    text: "U2",
    layer: "bottom",
    is_mirrored: true,
    is_visible: false,
  })

  expect(fabricationNoteText.is_mirrored).toBe(true)
  expect(fabricationNoteText.is_visible).toBe(false)
})
