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

test("pcb_board with shape rect", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    shape: "rect",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
  })

  expect(board.shape).toBe("rect")
  expect(board.width).toBe(10)
  expect(board.height).toBe(20)
})

test("pcb_board with shape polygon", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    shape: "polygon",
    center: { x: 0, y: 0 },
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  })

  expect(board.shape).toBe("polygon")
  expect(board.outline?.length).toBe(4)
})

test("pcb_board shape property is optional", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "10mm",
    height: "20mm",
    center: { x: 0, y: 0 },
  })

  expect(board.shape).toBeUndefined()
})
