import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("pcb_board keeps the blind and buried via flag optional", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
  })

  expect(board.allow_blind_and_buried_vias).toBeUndefined()
})
