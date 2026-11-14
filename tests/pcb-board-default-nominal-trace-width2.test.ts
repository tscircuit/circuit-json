import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("board default nominal trace width accepts numeric millimeters", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    default_nominal_trace_width: 0.35,
    min_trace_width: 0.1,
  })

  expect(board).toMatchObject({
    default_nominal_trace_width: 0.35,
    min_trace_width: 0.1,
  })
})
