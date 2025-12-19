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

test("pcb_board with anchor properties", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "100mm",
    height: "100mm",
    center: { x: 0, y: 0 },
    pcb_panel_id: "panel_1",
    anchor_position: { x: 10, y: 10 },
    anchor_alignment: "top_left",
    position_mode: "relative_to_panel_anchor",
    display_offset_x: "10mm",
    display_offset_y: "10mm",
  })

  expect(board.anchor_position).toEqual({ x: 10, y: 10 })
  expect(board.anchor_alignment).toBe("top_left")
  expect(board.position_mode).toBe("relative_to_panel_anchor")
  expect(board.display_offset_x).toBe("10mm")
  expect(board.display_offset_y).toBe("10mm")
})

test("pcb_board with grid position mode", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    width: "100mm",
    height: "100mm",
    center: { x: 0, y: 0 },
    pcb_panel_id: "panel_1",
    position_mode: "grid_in_panel",
    panel_grid_cell_width: "110mm",
    panel_grid_cell_height: "120mm",
  })

  expect(board.position_mode).toBe("grid_in_panel")
  expect(board.panel_grid_cell_width).toBe(110)
  expect(board.panel_grid_cell_height).toBe(120)
})
