import { test, expect } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("pcb_board accepts flex material", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
    material: "flex",
  })

  expect(board.material).toBe("flex")
})
