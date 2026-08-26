import { expect, test } from "bun:test"
import { any_circuit_element, schematic_graphic } from "../src"

const graphicAsset = {
  project_relative_path: "assets/system-block-diagram.svg",
  url: "https://example.com/system-block-diagram.svg",
  mimetype: "image/svg+xml",
}

test("schematic_graphic parses a required asset without SVG content", () => {
  const graphic = schematic_graphic.parse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
    asset: graphicAsset,
  })

  expect(graphic.schematic_graphic_id).toStartWith("schematic_graphic_")
  expect(graphic.schematic_sheet_id).toBe("schematic_sheet_1")
  expect(graphic.asset).toEqual(graphicAsset)
  expect(graphic.svg_content).toBeUndefined()
  expect(any_circuit_element.parse(graphic)).toEqual(graphic)
})
