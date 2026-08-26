import { expect, test } from "bun:test"
import { schematic_graphic } from "../src"

test("schematic_graphic requires an asset", () => {
  const result = schematic_graphic.safeParse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
    svg_content: "<svg />",
  })

  expect(result.success).toBe(false)
})
