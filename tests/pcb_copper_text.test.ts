import { expect, test } from "bun:test"
import { pcb_copper_text } from "../src/pcb/pcb_copper_text"

test("pcb_copper_text defaults", () => {
  const text = pcb_copper_text.parse({
    type: "pcb_copper_text",
    pcb_component_id: "pcb_component_123",
    text: "Copper",
    layer: "top",
  })

  expect(text.font).toBe("tscircuit2024")
  expect(text.font_size).toBeCloseTo(0.2)
  expect(text.is_knockout).toBeUndefined()
  expect(text.knockout_padding).toBeUndefined()
  expect(text.is_mirrored).toBeUndefined()
  expect(text.anchor_position).toEqual({ x: 0, y: 0 })
  expect(text.anchor_alignment).toBe("center")
})

test("pcb_copper_text allows overrides", () => {
  const text = pcb_copper_text.parse({
    type: "pcb_copper_text",
    pcb_component_id: "pcb_component_123",
    text: "Bottom Copper",
    layer: "bottom",
    font_size: "0.4mm",
    is_knockout: true,
    knockout_padding: {
      left: "0.1mm",
      top: "0.3mm",
      bottom: "0.1mm",
      right: "0.3mm",
    },
    ccw_rotation: 45,
    is_mirrored: true,
    anchor_position: { x: 1, y: 2 },
    anchor_alignment: "bottom_right",
  })

  expect(text.font_size).toBeCloseTo(0.4)
  expect(text.is_knockout).toBe(true)
  expect(text.knockout_padding).toEqual({
    left: 0.1,
    top: 0.3,
    bottom: 0.1,
    right: 0.3,
  })
  expect(text.ccw_rotation).toBe(45)
  expect(text.is_mirrored).toBe(true)
  expect(text.anchor_position).toEqual({ x: 1, y: 2 })
  expect(text.anchor_alignment).toBe("bottom_right")
})
