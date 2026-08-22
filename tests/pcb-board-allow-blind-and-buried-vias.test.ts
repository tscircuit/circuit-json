import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("pcb_board parses the blind and buried via flag", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
    num_layers: 4,
    allow_blind_and_buried_vias: true,
  })

  expect(board.allow_blind_and_buried_vias).toBe(true)
})
