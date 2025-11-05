import { test, expect } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("pcb_board with width and height (rectangular board)", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
  })

  expect(board.width).toBe(10)
  expect(board.height).toBe(20)
  expect(board.center).toEqual({ x: 0, y: 0 })
})

test("pcb_board with outline allows width and height to be omitted", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  })

  expect(board.width).toBeUndefined()
  expect(board.height).toBeUndefined()
  expect(board.outline?.length).toBe(4)
})

test("pcb_board can have both width/height and outline", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  })

  expect(board.width).toBe(10)
  expect(board.height).toBe(20)
  expect(board.outline?.length).toBe(4)
})
