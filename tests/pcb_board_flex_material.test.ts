import { expect, test } from "bun:test"
import { any_circuit_element, pcb_board, type PcbBoardInput } from "src"

test("flex boards validate through the board schema and Circuit JSON union", () => {
  const input = {
    type: "pcb_board",
    material: "flex",
    center: { x: 0, y: 0 },
    thickness: "0.15mm",
    num_layers: 2,
  } satisfies PcbBoardInput
  const board = pcb_board.parse(input)
  expect(board.material).toBe("flex")
  expect(board.thickness).toBe(0.15)
  expect(any_circuit_element.parse(board)).toEqual(board)
  expect(pcb_board.parse({ ...input, material: undefined }).material).toBe("fr4")
})
