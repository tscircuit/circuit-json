import { expect, test } from "bun:test"
import "bun-match-svg"
import {
  drawing_page,
  drawing_page_title_block,
  any_circuit_element,
  getDrawingPageDimensions,
  drawingPageSizes,
} from "../src"
test("standard page dimensions and ISO-referenced title-block metadata", async () => {
  for (const size of Object.keys(
    drawingPageSizes,
  ) as (keyof typeof drawingPageSizes)[]) {
    for (const orientation of ["landscape", "portrait"] as const) {
      const dimensions = getDrawingPageDimensions(size, orientation)
      const page = {
        type: "drawing_page" as const,
        drawing_page_id: size,
        page_size: size,
        orientation,
        ...dimensions,
      }
      expect(any_circuit_element.parse(page)).toEqual(page)
      expect(
        drawing_page.safeParse({ ...page, width: dimensions.width + 1 })
          .success,
      ).toBe(false)
    }
  }
  expect(getDrawingPageDimensions("ansi_a")).toEqual({
    width: 279.4,
    height: 215.9,
  })
  const block = drawing_page_title_block.parse({
    type: "drawing_page_title_block",
    drawing_page_title_block_id: "tb",
    drawing_page_id: "iso_a4",
    title: "Housing",
    legal_owner: "Example Ltd",
    identification_number: "H-001",
    revision_index: "A",
    date_of_issue: "2026-10-22",
    creator: "Designer",
    approval_person: "Checker",
    sheet_number: 1,
    number_of_sheets: 2,
  })
  expect(any_circuit_element.parse(block)).toEqual(block)
  expect(
    drawing_page_title_block.safeParse({ ...block, sheet_number: 3 }).success,
  ).toBe(false)
  expect(
    drawing_page_title_block.safeParse({ ...block, number_of_sheets: 0 })
      .success,
  ).toBe(false)
  expect(
    drawing_page.safeParse({
      type: "drawing_page" as const,
      drawing_page_id: "custom",
      width: 100,
      height: 100,
      orientation: "portrait",
    }).success,
  ).toBe(false)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="594" height="420" viewBox="0 0 297 210"><rect width="297" height="210" fill="white"/><rect x="5" y="5" width="287" height="200" fill="none" stroke="black"/><text x="10" y="15" font-size="5">ISO A4 landscape · 297 × 210 mm</text><rect x="112" y="165" width="180" height="40" fill="none" stroke="black"/><text x="115" y="175" font-size="4">${block.title} · ${block.identification_number}</text><text x="115" y="185" font-size="4">${block.legal_owner} · Rev ${block.revision_index}</text><text x="115" y="195" font-size="4">${block.creator} · Sheet ${block.sheet_number}/${block.number_of_sheets}</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
