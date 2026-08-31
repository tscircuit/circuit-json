import { expect, test } from "bun:test"
import { pcb_note_text, pcb_silkscreen_text, schematic_text } from "../src"

const importedTypography = {
  font_family: "Times New Roman",
  font_weight: "bold" as const,
  font_style: "italic" as const,
}

test("schematic text preserves imported typography", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_imported",
    text: "Imported annotation",
    position: { x: 0, y: 0 },
    ...importedTypography,
  })

  expect(text).toMatchObject(importedTypography)
})

test("PCB text preserves imported typography", () => {
  const silkscreenText = pcb_silkscreen_text.parse({
    type: "pcb_silkscreen_text",
    pcb_silkscreen_text_id: "pcb_silkscreen_text_imported",
    pcb_component_id: "pcb_component_imported",
    text: "Imported legend",
    layer: "top",
    ...importedTypography,
  })
  const noteText = pcb_note_text.parse({
    type: "pcb_note_text",
    pcb_note_text_id: "pcb_note_text_imported",
    text: "Imported note",
    ...importedTypography,
  })

  expect(silkscreenText).toMatchObject(importedTypography)
  expect(noteText).toMatchObject(importedTypography)
})
