import { expect, test } from "bun:test"
import { pcb_note_dimension } from "../src/pcb/pcb_note_dimension"
import { pcb_note_line } from "../src/pcb/pcb_note_line"
import { pcb_note_path } from "../src/pcb/pcb_note_path"
import { pcb_note_rect } from "../src/pcb/pcb_note_rect"
import { pcb_note_text } from "../src/pcb/pcb_note_text"

test("pcb note text defaults", () => {
  const note = pcb_note_text.parse({
    type: "pcb_note_text",
    pcb_component_id: "pcb_component_1",
    text: "Check orientation",
    layer: "top",
  })

  expect(note.font).toBe("tscircuit2024")
  expect(note.font_size).toBeCloseTo(1)
  expect(note.anchor_position).toEqual({ x: 0, y: 0 })
})

test("pcb note rect defaults", () => {
  const rect = pcb_note_rect.parse({
    type: "pcb_note_rect",
    pcb_component_id: "pcb_component_1",
    center: { x: "10mm", y: "5mm" },
    width: "4mm",
    height: "2mm",
    layer: "bottom",
  })

  expect(rect.stroke_width).toBeCloseTo(0.1)
  expect(rect.center.x).toBeCloseTo(10)
  expect(rect.center.y).toBeCloseTo(5)
})

test("pcb note path defaults", () => {
  const path = pcb_note_path.parse({
    type: "pcb_note_path",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    route: [
      { x: 0, y: 0 },
      { x: "2mm", y: "1mm" },
    ],
  })

  expect(path.stroke_width).toBeCloseTo(0.1)
  expect(path.route[1]!.x).toBeCloseTo(2)
})

test("pcb note line defaults", () => {
  const line = pcb_note_line.parse({
    type: "pcb_note_line",
    pcb_component_id: "pcb_component_1",
    layer: "bottom",
    x1: 0,
    y1: 0,
    x2: "1mm",
    y2: "2mm",
  })

  expect(line.stroke_width).toBeCloseTo(0.1)
  expect(line.x2).toBeCloseTo(1)
  expect(line.y2).toBeCloseTo(2)
})

test("pcb note dimension defaults", () => {
  const dimension = pcb_note_dimension.parse({
    type: "pcb_note_dimension",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    from: { x: 0, y: 0 },
    to: { x: "10mm", y: 0 },
  })

  expect(dimension.offset).toBe(0)
  expect(dimension.font_size).toBeCloseTo(1)
  expect(dimension.arrow_size).toBeCloseTo(1)
  expect(dimension.to.x).toBeCloseTo(10)
})
