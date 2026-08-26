import { expect, test } from "bun:test"
import { any_circuit_element, schematic_graphic } from "../src"

test("schematic_graphic accepts optional SVG content", () => {
  const svgContent =
    '<svg viewBox="0 0 100 50"><rect width="100" height="50" /></svg>'
  const asset = {
    project_relative_path: "assets/system-block-diagram.svg",
    url: "https://example.com/system-block-diagram.svg",
    mimetype: "image/svg+xml",
  }

  const graphic = schematic_graphic.parse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
    asset,
    svg_content: svgContent,
  })

  expect(graphic.asset).toEqual(asset)
  expect(graphic.svg_content).toBe(svgContent)
  expect(any_circuit_element.parse(graphic)).toEqual(graphic)
})
