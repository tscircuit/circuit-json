import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board } from "../src/pcb/pcb_board"

test("JLCPCB stackup selection survives Circuit JSON parsing without resolving board properties", () => {
  const input = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
  }
  const legacy_board = pcb_board.parse(input)
  expect(legacy_board).not.toHaveProperty("jlcpcb_stackup_id")

  const board = pcb_board.parse({
    ...input,
    jlcpcb_stackup_id: "JLC04161H-3313",
  })
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(board)))).toEqual(
    board,
  )
  expect(board).toEqual({
    ...legacy_board,
    jlcpcb_stackup_id: "JLC04161H-3313",
  })

  for (const invalid of ["", " ", 123, null]) {
    expect(
      pcb_board.safeParse({ ...input, jlcpcb_stackup_id: invalid }).success,
    ).toBe(false)
  }
})
