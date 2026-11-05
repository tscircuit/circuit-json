import { expect, test } from "bun:test"
import { any_circuit_element, pcb_board, type PcbBoardInput } from "src"

test("board defaults and material overrides validate through the board schema and Circuit JSON union", () => {
  const defaults = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
  })
  expect(defaults).toMatchObject({ material: "fr4", thickness: 1.6 })
  expect(any_circuit_element.parse(defaults)).toEqual(defaults)

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
  expect(pcb_board.parse({ ...input, material: undefined }).material).toBe(
    "fr4",
  )
  expect(
    pcb_board.parse({ ...input, material: "fr1", thickness: 1.4 }),
  ).toMatchObject({ material: "fr1", thickness: 1.4 })
})
