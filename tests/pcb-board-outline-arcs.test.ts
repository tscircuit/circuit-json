import { expect, test } from "bun:test"
import { any_circuit_element, pcb_board } from "../src"

test("rounded board outlines retain their four arcs through JSON round trips", () => {
  const bulge = Math.tan(Math.PI / 8)
  const outline = [
    { x: -7, y: -5, bulge: 0 },
    { x: 7, y: -5, bulge },
    { x: 10, y: -2 },
    { x: 10, y: 2, bulge },
    { x: 7, y: 5 },
    { x: -7, y: 5, bulge },
    { x: -10, y: 2 },
    { x: -10, y: -2, bulge },
  ]
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    outline,
  })

  expect(board.outline).toEqual(outline)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(board)))).toEqual(
    board,
  )
})
