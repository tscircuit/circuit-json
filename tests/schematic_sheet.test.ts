import { expect, test } from "bun:test"
import { schematic_sheet } from "../src/schematic/schematic_sheet"

test("schematic_sheet parse", () => {
  const sheet = schematic_sheet.parse({
    type: "schematic_sheet",
    schematic_sheet_id: "sheet1",
    name: "Main Schematic",
    sheet_index: 0,
    sheet_size: "ansi_b",
    sheet_width: 431.8,
    sheet_height: 279.4,
  })

  expect(sheet.type).toBe("schematic_sheet")
  expect(sheet.schematic_sheet_id).toBe("sheet1")
  expect(sheet.name).toBe("Main Schematic")
  expect(sheet.sheet_index).toBe(0)
  expect(sheet.sheet_size).toBe("ansi_b")
  expect(sheet.sheet_width).toBe(431.8)
  expect(sheet.sheet_height).toBe(279.4)
})

test("schematic_sheet rejects unsupported sheet sizes", () => {
  expect(() =>
    schematic_sheet.parse({
      type: "schematic_sheet",
      schematic_sheet_id: "sheet1",
      sheet_size: "A3",
    }),
  ).toThrow()
})

test("schematic_sheet rejects non-positive explicit dimensions", () => {
  expect(() =>
    schematic_sheet.parse({
      type: "schematic_sheet",
      schematic_sheet_id: "sheet1",
      sheet_width: 0,
      sheet_height: -1,
    }),
  ).toThrow()
})
