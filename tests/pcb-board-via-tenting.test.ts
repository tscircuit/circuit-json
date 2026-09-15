import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board, type PcbBoardInput } from "../src/pcb/pcb_board"

test("pcb_board preserves explicit via tenting defaults and leaves omitted defaults absent", () => {
  const input: PcbBoardInput = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    default_via_tented_on_top: true,
    default_via_tented_on_bottom: false,
  }

  const board = pcb_board.parse(input)
  expect(board).toMatchObject({
    default_via_tented_on_top: true,
    default_via_tented_on_bottom: false,
  })
  expect(any_circuit_element.parse(input)).toEqual(board)

  const unspecifiedBoard = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
  })
  expect(unspecifiedBoard).not.toHaveProperty("default_via_tented_on_top")
  expect(unspecifiedBoard).not.toHaveProperty("default_via_tented_on_bottom")
})
