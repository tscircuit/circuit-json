import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board } from "../src/pcb/pcb_board"

test("board default nominal trace width is optional", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    min_trace_width: "0.1mm",
  })

  expect(board).not.toHaveProperty("default_nominal_trace_width")
  expect(any_circuit_element.parse(board)).toEqual(board)
  expect(board.min_trace_width).toBe(0.1)
})
