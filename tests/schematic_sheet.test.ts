import { expect, test } from "bun:test"
import { schematic_sheet } from "../src/schematic/schematic_sheet"

test("schematic_sheet parse", () => {
  const sheet = schematic_sheet.parse({
    type: "schematic_sheet",
    schematic_sheet_id: "sheet1",
    name: "Main Schematic",
    sheet_index: 0,
    paper_size: "ansi_b",
  })

  expect(sheet.type).toBe("schematic_sheet")
  expect(sheet.schematic_sheet_id).toBe("sheet1")
  expect(sheet.name).toBe("Main Schematic")
  expect(sheet.sheet_index).toBe(0)
  expect(sheet.paper_size).toBe("ansi_b")
})

test("schematic_sheet rejects unsupported paper sizes", () => {
  expect(() =>
    schematic_sheet.parse({
      type: "schematic_sheet",
      schematic_sheet_id: "sheet1",
      paper_size: "A3",
    }),
  ).toThrow()
})
