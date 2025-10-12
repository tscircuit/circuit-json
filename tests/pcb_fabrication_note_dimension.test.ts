import { expect, test } from "bun:test"
import { pcb_fabrication_note_dimension } from "../src/pcb/pcb_fabrication_note_dimension"

test("parse fabrication note dimension with defaults", () => {
  const dimension = pcb_fabrication_note_dimension.parse({
    type: "pcb_fabrication_note_dimension",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    from: { x: 0, y: 0 },
    to: { x: "10mm", y: 0 },
  })

  expect(dimension.font).toBe("tscircuit2024")
  expect(dimension.font_size).toBeCloseTo(1)
  expect(dimension.arrow_size).toBeCloseTo(1)
  expect(dimension.to).toEqual({ x: 10, y: 0 })
})

test("fabrication note dimension accepts reference strings", () => {
  const dimension = pcb_fabrication_note_dimension.parse({
    type: "pcb_fabrication_note_dimension",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    from: "pcb_point_start",
    to: "pcb_point_end",
    offset: "2mm",
  })

  expect(dimension.from).toBe("pcb_point_start")
  expect(dimension.to).toBe("pcb_point_end")
  expect(dimension.offset).toBeCloseTo(2)
})
