import { expect, test } from "bun:test"
import { schematic_sheet } from "../src/schematic/schematic_sheet"

test("schematic_sheet parse", () => {
  const sheet = schematic_sheet.parse({
    type: "schematic_sheet",
    schematic_sheet_id: "sheet1",
    name: "Main Schematic",
    sheet_index: 0,
    center: { x: 75, y: 47.5 },
    width: 150,
    height: 95,
    is_root: true,
  })

  expect(sheet.type).toBe("schematic_sheet")
  expect(sheet.schematic_sheet_id).toBe("sheet1")
  expect(sheet.name).toBe("Main Schematic")
  expect(sheet.sheet_index).toBe(0)
  expect(sheet.center).toEqual({ x: 75, y: 47.5 })
  expect(sheet.width).toBe(150)
  expect(sheet.height).toBe(95)
  expect(sheet.is_root).toBe(true)
})
