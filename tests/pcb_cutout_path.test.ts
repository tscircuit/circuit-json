import { test, expect } from "bun:test"
import { pcb_cutout_path } from "src/pcb/pcb_cutout"

test("pcb_cutout_path with continuous slot", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    pcb_cutout_id: "pcb_cutout_1",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ],
    slot_width: "2mm",
  })

  expect(cutout.shape).toBe("path")
  expect(cutout.route).toHaveLength(3)
  expect(cutout.slot_width).toBe(2)
  expect(cutout.slot_length).toBeUndefined()
  expect(cutout.space_between_slots).toBeUndefined()
})

test("pcb_cutout_path with dashed slots", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    pcb_cutout_id: "pcb_cutout_2",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
    ],
    slot_width: "1.5mm",
    slot_length: "3mm",
    space_between_slots: "2mm",
  })

  expect(cutout.shape).toBe("path")
  expect(cutout.slot_width).toBe(1.5)
  expect(cutout.slot_length).toBe(3)
  expect(cutout.space_between_slots).toBe(2)
})

test("pcb_cutout_path with numeric values", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    pcb_cutout_id: "pcb_cutout_3",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 5 },
    ],
    slot_width: 2,
    slot_length: 3,
    space_between_slots: 1,
  })

  expect(cutout.shape).toBe("path")
  expect(cutout.slot_width).toBe(2)
  expect(cutout.slot_length).toBe(3)
  expect(cutout.space_between_slots).toBe(1)
})

test("pcb_cutout_path with optional board and panel ids", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    pcb_cutout_id: "pcb_cutout_4",
    pcb_board_id: "pcb_board_1",
    pcb_panel_id: "pcb_panel_1",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ],
    slot_width: "1mm",
  })

  expect(cutout.pcb_board_id).toBe("pcb_board_1")
  expect(cutout.pcb_panel_id).toBe("pcb_panel_1")
})

test("pcb_cutout_path supports union type", () => {
  // Import the full union type
  const { pcb_cutout } = require("src/pcb/pcb_cutout")

  const cutout = pcb_cutout.parse({
    type: "pcb_cutout",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 },
    ],
    slot_width: "1.5mm",
    slot_length: "2mm",
    space_between_slots: "1mm",
  })

  expect(cutout.type).toBe("pcb_cutout")
  expect(cutout.shape).toBe("path")
})

test("pcb_cutout_path with square corners (corner_radius = 0)", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    slot_width: "2mm",
    slot_corner_radius: 0,
  })

  expect(cutout.slot_corner_radius).toBe(0)
})

test("pcb_cutout_path with rounded corners", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    slot_width: "2mm",
    slot_corner_radius: "0.5mm",
  })

  expect(cutout.slot_corner_radius).toBe(0.5)
})

test("pcb_cutout_path with fully circular slot (corner_radius = slot_width/2)", () => {
  const cutout = pcb_cutout_path.parse({
    type: "pcb_cutout",
    shape: "path",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    slot_width: "2mm",
    slot_corner_radius: "1mm", // Half of slot_width for circular
  })

  expect(cutout.slot_width).toBe(2)
  expect(cutout.slot_corner_radius).toBe(1)
})
