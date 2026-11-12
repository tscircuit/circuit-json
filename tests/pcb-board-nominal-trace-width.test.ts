import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board, type PcbBoardInput } from "../src/pcb/pcb_board"

test("board nominal width survives canonical parsing and JSON save/load independently of the minimum", () => {
  const input: PcbBoardInput = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    nominal_trace_width: "350um",
    min_trace_width: "0.1mm",
  }

  const board = pcb_board.parse(input)
  expect(board.nominal_trace_width).toBeCloseTo(0.35)
  expect(board.min_trace_width).toBe(0.1)
  expect(any_circuit_element.parse(input)).toEqual(board)

  const restored = any_circuit_element.parse(JSON.parse(JSON.stringify(board)))
  expect(restored).toEqual(board)
})

test("board nominal width accepts numeric millimeters", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    nominal_trace_width: 0.35,
    min_trace_width: 0.1,
  })

  expect(board).toMatchObject({
    nominal_trace_width: 0.35,
    min_trace_width: 0.1,
  })
})

test("boards without a nominal width retain the existing representation", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    min_trace_width: "0.1mm",
  })

  expect(board).not.toHaveProperty("nominal_trace_width")
  expect(any_circuit_element.parse(board)).toEqual(board)
  expect(board.min_trace_width).toBe(0.1)
})

test("board nominal width rejects non-length value types", () => {
  expect(
    pcb_board.safeParse({
      type: "pcb_board",
      center: { x: 0, y: 0 },
      nominal_trace_width: true,
    }).success,
  ).toBe(false)
})
