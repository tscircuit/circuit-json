import { expect, test } from "bun:test"
import { schematic_graphic } from "../src"

test("schematic_graphic requires at least one graphic source", () => {
  const result = schematic_graphic.safeParse({
    type: "schematic_graphic",
    schematic_sheet_id: "schematic_sheet_1",
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe(
      "At least one of asset or svg_content is required",
    )
  }
})
