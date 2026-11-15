import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board, type PcbBoardInput } from "../src/pcb/pcb_board"

test("board default nominal trace width survives canonical parsing and JSON save/load independently of the minimum", () => {
  const input: PcbBoardInput = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    default_nominal_trace_width: "350um",
    min_trace_width: "0.1mm",
  }

  const board = pcb_board.parse(input)
  expect(board.default_nominal_trace_width).toBeCloseTo(0.35)
  expect(board.min_trace_width).toBe(0.1)
  expect(any_circuit_element.parse(input)).toEqual(board)

  const restored = any_circuit_element.parse(JSON.parse(JSON.stringify(board)))
  expect(restored).toEqual(board)
})
