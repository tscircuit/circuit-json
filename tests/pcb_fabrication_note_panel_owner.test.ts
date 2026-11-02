import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_fabrication_note_path,
  pcb_fabrication_note_text,
} from "src"

test("panel score annotations do not need an invented component reference", () => {
  const path = {
    type: "pcb_fabrication_note_path",
    pcb_panel_id: "pcb_panel_0",
    layer: "top",
    route: [
      { x: 0, y: -20 },
      { x: 0, y: 20 },
    ],
    stroke_width: 0.1,
  }
  const text = {
    type: "pcb_fabrication_note_text",
    pcb_panel_id: "pcb_panel_0",
    layer: "top",
    text: "V-SCORE",
    anchor_position: { x: 0, y: 20 },
  }
  for (const annotation of [path, text]) {
    expect(any_circuit_element.safeParse(annotation).success).toBe(true)
  }
  expect(pcb_fabrication_note_path.parse(path)).toMatchObject({
    pcb_panel_id: "pcb_panel_0",
  })
  expect(pcb_fabrication_note_text.parse(text)).toMatchObject({
    pcb_panel_id: "pcb_panel_0",
  })
  expect(
    pcb_fabrication_note_path.parse({
      ...path,
      pcb_component_id: "pcb_component_0",
    }).pcb_component_id,
  ).toBe("pcb_component_0")
  expect(
    pcb_fabrication_note_text.parse({
      ...text,
      pcb_component_id: "pcb_component_0",
    }).pcb_component_id,
  ).toBe("pcb_component_0")
  for (const pcb_panel_id of [null, 42]) {
    expect(
      pcb_fabrication_note_path.safeParse({ ...path, pcb_panel_id }).success,
    ).toBe(false)
    expect(
      pcb_fabrication_note_text.safeParse({ ...text, pcb_panel_id }).success,
    ).toBe(false)
  }
})
