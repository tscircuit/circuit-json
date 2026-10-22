import { expect, test } from "bun:test"
import "bun-match-svg"
import { any_circuit_element, drawing_dimension } from "../src"

test("dimensions select one explicit target and normalize orientation defaults", async () => {
  // Geometry is a test-only stand-in for data read from the actual model.
  // These coordinates are not a Circuit JSON record.
  const modelEdge = {
    name: "outer_top",
    start: { x: -20, y: 12.5, z: 0 },
    end: { x: 20, y: 12.5, z: 0 },
  }
  const dimension = drawing_dimension.parse({
    type: "drawing_dimension",
    drawing_dimension_id: "dimension_width",
    drawing_part_view_id: "view_end",
    cad_component_id: "cad_rectangular_tube",
    edge_name: modelEdge.name,
  })
  expect(dimension).toEqual({
    type: "drawing_dimension",
    drawing_dimension_id: "dimension_width",
    drawing_part_view_id: "view_end",
    cad_component_id: "cad_rectangular_tube",
    edge_name: "outer_top",
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
  expect(any_circuit_element.parse(dimension)).toEqual(dimension)
  for (const field of [
    "drawing_dimension_id",
    "drawing_part_view_id",
    "cad_component_id",
    "edge_name",
  ])
    expect(
      drawing_dimension.safeParse({ ...dimension, [field]: " " }).success,
    ).toBe(false)
  for (const patch of [
    { orientation: "true-length" },
    { width_of_view: "true" },
    { height_of_view: 1 },
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
  expect(
    drawing_dimension.parse({
      ...dimension,
      width_of_view: false,
      height_of_view: false,
    }),
  ).toEqual(dimension)
  const { cad_component_id, edge_name, ...withoutEdge } = dimension
  expect(drawing_dimension.safeParse(withoutEdge).success).toBe(false)
  expect(
    drawing_dimension.safeParse({ ...withoutEdge, cad_component_id }).success,
  ).toBe(false)
  expect(
    drawing_dimension.safeParse({ ...withoutEdge, edge_name }).success,
  ).toBe(false)
  expect(
    drawing_dimension.parse({ ...dimension, edge_name: " Edge 1 " }).edge_name,
  ).toBe(" Edge 1 ")
  for (const [flag, orientation] of [
    ["width_of_view", "horizontal"],
    ["height_of_view", "vertical"],
  ] as const) {
    const { orientation: previousOrientation, ...withoutOrientation } =
      withoutEdge
    const preset = { ...withoutOrientation, [flag]: true }
    const parsed = drawing_dimension.parse(preset)
    expect(parsed[flag]).toBe(true)
    expect(parsed.orientation).toBe(orientation)
    expect(parsed.cad_component_id).toBeUndefined()
    expect(parsed.edge_name).toBeUndefined()
    expect(any_circuit_element.parse(preset)).toEqual(parsed)
    expect(drawing_dimension.parse({ ...preset, orientation })).toEqual(parsed)
    const opposite =
      flag === "width_of_view" ? "height_of_view" : "width_of_view"
    expect(drawing_dimension.parse({ ...preset, [opposite]: false })).toEqual(
      parsed,
    )
    expect(
      drawing_dimension.safeParse({ ...preset, [opposite]: true }).success,
    ).toBe(false)
    for (const edgeTarget of [
      { cad_component_id },
      { edge_name },
      { cad_component_id, edge_name },
    ])
      expect(
        drawing_dimension.safeParse({ ...preset, ...edgeTarget }).success,
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
  for (const flags of [
    { width_of_view: false },
    { height_of_view: false },
    { width_of_view: false, height_of_view: false },
    { width_of_view: true, height_of_view: true },
  ])
    expect(
      drawing_dimension.safeParse({ ...withoutEdge, ...flags }).success,
    ).toBe(false)
  const measured = Math.hypot(
    modelEdge.end.x - modelEdge.start.x,
    modelEdge.end.y - modelEdge.start.y,
    modelEdge.end.z - modelEdge.start.z,
  )
  // Schema-level illustration. Actual model projection is tested in the exporter.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 160 105"><rect width="160" height="105" fill="white"/><rect x="3" y="3" width="154" height="99" fill="none" stroke="black" stroke-width="0.3"/><text x="10" y="13" font-size="4">RECTANGULAR TUBE — END VIEW</text><g transform="translate(40 35) scale(2)"><path d="M 0 0 H 40 V 25 H 0 Z M 2 2 V 23 H 38 V 2 Z" fill="#eee" fill-rule="evenodd" stroke="black" stroke-width="0.3"/><path d="M 0 -2 V -10 M 40 -2 V -10 M 0 -8 H 16 M 24 -8 H 40" fill="none" stroke="black" stroke-width="0.2"/><path d="M 0 -8 L 2 -8.6 L 2 -7.4 Z M 40 -8 L 38 -8.6 L 38 -7.4 Z" fill="black"/><text x="20" y="-7" text-anchor="middle" font-size="2.5">${measured.toFixed(dimension.precision)}</text></g><text x="10" y="98" font-size="2.8">Dimensions in model mm; signed offset in paper mm</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
