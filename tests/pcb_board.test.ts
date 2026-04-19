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

test("pcb_board with manufacturing drc properties", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    min_trace_width: "0.12mm",
    min_via_to_via_spacing: "0.2mm",
    min_trace_to_pad_spacing: "0.15mm",
    min_pad_to_pad_spacing: "0.18mm",
    min_via_hole_diameter: "0.25mm",
    min_via_pad_diameter: "0.45mm",
  })

  expect(board.min_trace_width).toBe(0.12)
  expect(board.min_via_to_via_spacing).toBe(0.2)
  expect(board.min_trace_to_pad_spacing).toBe(0.15)
  expect(board.min_pad_to_pad_spacing).toBe(0.18)
  expect(board.min_via_hole_diameter).toBe(0.25)
  expect(board.min_via_pad_diameter).toBe(0.45)
})
