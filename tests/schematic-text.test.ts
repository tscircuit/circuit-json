import { expect, test } from "bun:test"
import { schematic_text } from "../src/schematic/schematic_text"

test("schematic_text accepts font size distance strings", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_1",
    text: "R1",
    font_size: "0.4mm",
    position: { x: 0, y: 0 },
  })

  expect(text.font_size).toBeCloseTo(0.4)
})

test("schematic_text defaults font size", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_1",
    text: "R1",
    position: { x: 0, y: 0 },
  })

  expect(text.font_size).toBeCloseTo(0.18)
})
