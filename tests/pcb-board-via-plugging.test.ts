import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board, type PcbBoardInput } from "../src/pcb/pcb_board"

test("pcb_board preserves optional via plugging independently of tenting", () => {
  const input: PcbBoardInput = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
  }

  expect(pcb_board.parse(input)).not.toHaveProperty("default_via_plugged")

  const pluggedBoard = any_circuit_element.parse({
    ...input,
    default_via_plugged: true,
    default_via_tented_on_top: false,
    default_via_tented_on_bottom: false,
  })
  expect(pluggedBoard).toMatchObject({
    default_via_plugged: true,
    default_via_tented_on_top: false,
    default_via_tented_on_bottom: false,
  })

  const tentedBoard = pcb_board.parse({
    ...input,
    default_via_plugged: false,
    default_via_tented_on_top: true,
    default_via_tented_on_bottom: true,
  })
  expect(tentedBoard).toMatchObject({
    default_via_plugged: false,
    default_via_tented_on_top: true,
    default_via_tented_on_bottom: true,
  })
  expect(
    pcb_board.safeParse({ ...input, default_via_plugged: "true" }).success,
  ).toBe(false)
})
