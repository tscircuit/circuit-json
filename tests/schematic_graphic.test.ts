import { expect, test } from "bun:test"
import { any_circuit_element, schematic_graphic } from "../src"

test("schematic_graphic parses SVG content", () => {
  const svgContent =
    '<svg viewBox="0 0 100 50"><rect width="100" height="50" /></svg>'

  const graphic = schematic_graphic.parse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
    svg_content: svgContent,
  })

  expect(graphic.schematic_graphic_id).toStartWith("schematic_graphic_")
  expect(graphic.schematic_sheet_id).toBe("schematic_sheet_1")
  expect(graphic.svg_content).toBe(svgContent)
  expect(any_circuit_element.parse(graphic)).toEqual(graphic)
})

test("schematic_graphic requires SVG content", () => {
  const result = schematic_graphic.safeParse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
  })

  expect(result.success).toBe(false)
})
