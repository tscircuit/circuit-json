import { expect, test } from "bun:test"
import { pcb_note_path } from "../src/pcb/pcb_note_path"

test("parses an arc bulge on a PCB note path", () => {
  const path = pcb_note_path.parse({
    type: "pcb_note_path",
    pcb_note_path_id: "pcb_note_path_arc",
    route: [
      { x: 0, y: 0, bulge: 0.41421356237309503 },
      { x: 1, y: 1 },
    ],
  })

  expect(path.route[0]?.bulge).toBe(0.41421356237309503)
})
