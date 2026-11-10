import { expect, test } from "bun:test"
import { pcb_board } from "src/pcb/pcb_board"

test("board round trip preserves nominal trace width separately from the manufacturing minimum", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    min_trace_width: "0.1mm",
    nominal_trace_width: "350um",
  })
  expect(board.nominal_trace_width).toBeCloseTo(0.35)
  expect(board.min_trace_width).toBe(0.1)
})
