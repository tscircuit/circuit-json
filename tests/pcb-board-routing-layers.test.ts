import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("a four-layer board can reserve inner layers for planes", () => {
  const board = { type: "pcb_board", center: { x: 0, y: 0 }, num_layers: 4 }
  expect(pcb_board.parse(board).routing_layers).toBeUndefined()
  expect(
    pcb_board.parse({ ...board, routing_layers: ["top", "bottom"] })
      .routing_layers,
  ).toEqual(["top", "bottom"])
  expect(pcb_board.safeParse({ ...board, routing_layers: [] }).success).toBe(
    false,
  )
})
