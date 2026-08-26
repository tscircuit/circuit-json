import { expect, test } from "bun:test"
import {
  any_circuit_element,
  schematic_graphic,
  type SchematicGraphic,
  type SchematicGraphicInput,
} from "../src"

test("schematic_graphic accepts SVG content without an asset", () => {
  const input: SchematicGraphicInput = {
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
    svg_content: "<svg />",
  }
  const graphic: SchematicGraphic = schematic_graphic.parse(input)

  expect(graphic.asset).toBeUndefined()
  expect(graphic.svg_content).toBe("<svg />")
  expect(any_circuit_element.parse(graphic)).toEqual(graphic)
})
