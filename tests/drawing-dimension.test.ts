import { expect, test } from "bun:test"
import "bun-match-svg"
import { any_circuit_element, cad_named_edge, drawing_dimension } from "../src"

test("dimensions retain named-edge associations and normalize paper-space defaults", async () => {
  const edge = cad_named_edge.parse({
    type: "cad_named_edge",
    cad_named_edge_id: "edge_width",
    cad_component_id: "cad_rectangular_tube",
    name: "outer_top",
    start: { x: -20, y: 12.5, z: 0 },
    end: { x: 20, y: 12.5, z: 0 },
  })
  const dimension = drawing_dimension.parse({
    type: "drawing_dimension",
    drawing_dimension_id: "dimension_width",
    drawing_part_view_id: "view_end",
    cad_named_edge_id: edge.cad_named_edge_id,
  })
  expect(dimension).toEqual({
    type: "drawing_dimension",
    drawing_dimension_id: "dimension_width",
    drawing_part_view_id: "view_end",
    cad_named_edge_id: "edge_width",
    measurement: "edge",
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
  expect(any_circuit_element.parse(dimension)).toEqual(dimension)
  for (const field of [
    "drawing_dimension_id",
    "drawing_part_view_id",
    "cad_named_edge_id",
  ])
    expect(
      drawing_dimension.safeParse({ ...dimension, [field]: " " }).success,
    ).toBe(false)
  for (const patch of [
    { orientation: "true-length" },
    { offset: Infinity },
    { offset: NaN },
    { precision: -1 },
    { precision: 7 },
    { precision: 1.5 },
    { precision: "2" },
  ])
    expect(
      drawing_dimension.safeParse({ ...dimension, ...patch }).success,
    ).toBe(false)
  expect(
    drawing_dimension.parse({
      ...dimension,
      orientation: "horizontal",
      offset: -8,
      precision: 0,
    }),
  ).toMatchObject({ orientation: "horizontal", offset: -8, precision: 0 })
  expect(
    drawing_dimension.parse({
      ...dimension,
      orientation: "vertical",
      offset: 0,
      precision: 6,
    }),
  ).toMatchObject({ orientation: "vertical", offset: 0, precision: 6 })
  expect(
    drawing_dimension.parse({ ...dimension, value: 99, text: "99" }),
  ).toEqual(dimension)
  const { cad_named_edge_id, ...withoutEdge } = dimension
  expect(drawing_dimension.safeParse(withoutEdge).success).toBe(false)
  for (const [measurement, orientation] of [
    ["view_width", "horizontal"],
    ["view_height", "vertical"],
  ] as const) {
    const { orientation: previousOrientation, ...withoutOrientation } =
      withoutEdge
    const preset = { ...withoutOrientation, measurement }
    const parsed = drawing_dimension.parse(preset)
    expect(parsed.measurement).toBe(measurement)
    expect(parsed.orientation).toBe(orientation)
    expect(parsed.cad_named_edge_id).toBeUndefined()
    expect(any_circuit_element.parse(preset)).toEqual(parsed)
    expect(drawing_dimension.parse({ ...preset, orientation })).toEqual(parsed)
    expect(
      drawing_dimension.safeParse({ ...preset, cad_named_edge_id }).success,
    ).toBe(false)
    for (const conflicting of [
      "aligned",
      orientation === "horizontal" ? "vertical" : "horizontal",
    ])
      expect(
        drawing_dimension.safeParse({ ...preset, orientation: conflicting })
          .success,
      ).toBe(false)
  }
  expect(
    drawing_dimension.safeParse({ ...dimension, measurement: "overall_width" })
      .success,
  ).toBe(false)
  const measured = Math.hypot(
    edge.end.x - edge.start.x,
    edge.end.y - edge.start.y,
    edge.end.z - edge.start.z,
  )
  // Schema-level illustration. Actual model projection is tested in the exporter.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 160 105"><rect width="160" height="105" fill="white"/><rect x="3" y="3" width="154" height="99" fill="none" stroke="black" stroke-width="0.3"/><text x="10" y="13" font-size="4">RECTANGULAR TUBE — END VIEW</text><g transform="translate(40 35) scale(2)"><path d="M 0 0 H 40 V 25 H 0 Z M 2 2 V 23 H 38 V 2 Z" fill="#eee" fill-rule="evenodd" stroke="black" stroke-width="0.3"/><path d="M 0 -2 V -10 M 40 -2 V -10 M 0 -8 H 16 M 24 -8 H 40" fill="none" stroke="black" stroke-width="0.2"/><path d="M 0 -8 L 2 -8.6 L 2 -7.4 Z M 40 -8 L 38 -8.6 L 38 -7.4 Z" fill="black"/><text x="20" y="-7" text-anchor="middle" font-size="2.5">${measured.toFixed(dimension.precision)}</text></g><text x="10" y="98" font-size="2.8">Dimensions in model mm; signed offset in paper mm</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
