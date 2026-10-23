import { expect, test } from "bun:test"
import "bun-match-svg"
import {
  any_circuit_element,
  drawing_dimension_line,
  type DrawingDimensionLine,
  type DrawingDimensionLineInput,
} from "../src"

test("resolved dimension lines preserve paper strokes, exact text and independent witness attachments", async () => {
  const input: DrawingDimensionLineInput = {
    type: "drawing_dimension_line",
    drawing_dimension_line_id: "line_outer_width",
    drawing_part_view_id: "tube_end_view",
    start: { x: -10, y: 20 },
    end: { x: 10, y: 20 },
    text: "40.0 mm",
  }
  const line: DrawingDimensionLine = drawing_dimension_line.parse(input)
  expect(line).toEqual(input)
  expect(any_circuit_element.parse(line)).toEqual(line)
  const annotated = {
    ...line,
    name: "outer-width",
    edge_ref_start: { x: -10, y: 10 },
    edge_ref_end: { x: 10, y: 10 },
    edge_ref_name: "outer_top",
  }
  expect(drawing_dimension_line.parse(annotated)).toEqual(annotated)
  expect(
    drawing_dimension_line.parse({ ...line, edge_ref_start: line.start }),
  ).toEqual({ ...line, edge_ref_start: line.start })
  expect(
    drawing_dimension_line.parse({ ...line, edge_ref_end: line.end }),
  ).toEqual({ ...line, edge_ref_end: line.end })
  expect(
    drawing_dimension_line.parse({ ...line, start: line.end, end: line.start }),
  ).toEqual({ ...line, start: line.end, end: line.start })
  const exact = {
    ...line,
    text: "  ⌀ 40.0 ±0.1 mm  ",
    edge_ref_name: "  authored feature name  ",
  }
  expect(drawing_dimension_line.parse(exact)).toEqual(exact)

  for (const field of [
    "type",
    "drawing_dimension_line_id",
    "drawing_part_view_id",
    "start",
    "end",
    "text",
  ])
    expect(
      drawing_dimension_line.safeParse({ ...line, [field]: undefined }).success,
    ).toBe(false)
  for (const field of [
    "drawing_dimension_line_id",
    "drawing_part_view_id",
    "text",
    "edge_ref_name",
    "name",
  ])
    for (const value of ["", " \n\t ", 42])
      expect(
        drawing_dimension_line.safeParse({ ...line, [field]: value }).success,
      ).toBe(false)
  for (const field of ["start", "end", "edge_ref_start", "edge_ref_end"])
    for (const value of [
      null,
      { x: 1 },
      { y: 1 },
      { x: Infinity, y: 0 },
      { x: 0, y: -Infinity },
      { x: NaN, y: 0 },
      { x: 0, y: NaN },
      { x: "1mm", y: 0 },
      [1, 2],
    ])
      expect(
        drawing_dimension_line.safeParse({ ...line, [field]: value }).success,
      ).toBe(false)
  expect(
    drawing_dimension_line.safeParse({ ...line, end: line.start }).success,
  ).toBe(false)
  // Distinctness is exact and does not introduce an epsilon or overflow.
  expect(
    drawing_dimension_line.safeParse({
      ...line,
      start: { x: 0, y: 0 },
      end: { x: Number.MIN_VALUE, y: 0 },
    }).success,
  ).toBe(true)
  expect(
    drawing_dimension_line.safeParse({
      ...line,
      start: { x: -Number.MAX_VALUE, y: 0 },
      end: { x: Number.MAX_VALUE, y: 0 },
    }).success,
  ).toBe(true)
  expect(
    any_circuit_element.safeParse({
      type: "drawing_dimension",
      drawing_dimension_id: "old_dimension",
      drawing_part_view_id: "tube_end_view",
      cad_component_id: "cad_tube",
      edge_name: "inner_top",
    }).success,
  ).toBe(false)
  expect(
    drawing_dimension_line.parse({
      ...line,
      width_of_view: true,
      height_of_view: true,
      cad_component_id: "cad_tube",
      edge_name: "inner_top",
      orientation: "horizontal",
      offset: 8,
      precision: 1,
    }),
  ).toEqual(line)

  // A 20 mm paper span at 1:2 carries the 40 mm model measurement formatted by core.
  const svgPoint = ({ x, y }: { x: number; y: number }) => ({
    x: 80 + x * 2,
    y: 70 - y * 2,
  })
  const start = svgPoint(annotated.start)
  const end = svgPoint(annotated.end)
  const witnessStart = svgPoint(annotated.edge_ref_start)
  const witnessEnd = svgPoint(annotated.edge_ref_end)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 160 105"><rect width="160" height="105" fill="white"/><rect x="3" y="3" width="154" height="99" fill="none" stroke="black" stroke-width="0.3"/><text x="10" y="13" font-size="4">RESOLVED DIMENSION LINE — SCALE 1:2</text><path d="M 60 50 H 100 V 70 H 60 Z M 63 53 V 67 H 97 V 53 Z" fill="#eee" fill-rule="evenodd" stroke="black" stroke-width="0.3"/><path d="M ${witnessStart.x} ${witnessStart.y} V ${start.y - 3} M ${witnessEnd.x} ${witnessEnd.y} V ${end.y - 3} M ${start.x} ${start.y} H 70 M 90 ${end.y} H ${end.x}" fill="none" stroke="black" stroke-width="0.3"/><path d="M ${start.x} ${start.y} l 3 -1 v 2 Z M ${end.x} ${end.y} l -3 -1 v 2 Z" fill="black"/><text x="80" y="31" text-anchor="middle" font-size="3.5">${annotated.text}</text><text x="10" y="91" font-size="3">20 mm paper span; preformatted model measurement 40.0 mm</text><text x="10" y="98" font-size="2.8">Page-centered paper coordinates; witness endpoints supplied independently</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
