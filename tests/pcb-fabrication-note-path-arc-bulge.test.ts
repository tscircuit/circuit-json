import { expect, test } from "bun:test"
import { pcb_fabrication_note_path } from "../src/pcb/pcb_fabrication_note_path"

test("parses an arc bulge on a PCB fabrication note path", () => {
  const path = pcb_fabrication_note_path.parse({
    type: "pcb_fabrication_note_path",
    pcb_fabrication_note_path_id: "pcb_fabrication_note_path_arc",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    route: [
      { x: 0, y: 0, bulge: -0.41421356237309503 },
      { x: 1, y: -1 },
    ],
    stroke_width: 0.1,
  })

  expect(path.route[0]?.bulge).toBe(-0.41421356237309503)
})
