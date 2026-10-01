import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_board, type PcbBoardInput } from "../src/pcb/pcb_board"

const board: PcbBoardInput = {
  type: "pcb_board",
  pcb_board_id: "pcb_board_1",
  center: { x: 0, y: 0 },
}

test("pcb_board preserves each manufacturing via plugging choice", () => {
  for (const via_plugging of [
    "solder_mask_ink",
    "epoxy_filled_and_capped",
    "copper_paste_filled_and_capped",
  ] as const) {
    const input: PcbBoardInput = { ...board, via_plugging }
    const parsed = any_circuit_element.parse(input)
    expect(parsed).toMatchObject(input)
    expect(parsed).not.toHaveProperty("default_via_plugged")
    expect(parsed).not.toHaveProperty("default_via_tented_on_top")
    expect(parsed).not.toHaveProperty("default_via_tented_on_bottom")
  }
})

test("via plugging is optional and does not reinterpret legacy plugging", () => {
  expect(pcb_board.parse(board)).not.toHaveProperty("via_plugging")
  for (const default_via_plugged of [true, false]) {
    const input = { ...board, default_via_plugged }
    const parsed = pcb_board.parse(input)
    expect(parsed).toMatchObject(input)
    expect(parsed).not.toHaveProperty("via_plugging")
  }
  for (const via_plugging of [
    true,
    false,
    "tented",
    "untented",
    "epoxy",
    null,
  ]) {
    expect(pcb_board.safeParse({ ...board, via_plugging }).success).toBe(false)
  }
})
