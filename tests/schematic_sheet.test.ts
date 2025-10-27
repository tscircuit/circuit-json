import { expect, test } from "bun:test"
import { schematic_sheet } from "../src/schematic/schematic_sheet"

test("schematic_sheet parse", () => {
  const sheet = schematic_sheet.parse({
    type: "schematic_sheet",
    schematic_sheet_id: "sheet1",
    name: "Main Schematic",
  })

  expect(sheet.type).toBe("schematic_sheet")
  expect(sheet.schematic_sheet_id).toBe("sheet1")
  expect(sheet.name).toBe("Main Schematic")
})
