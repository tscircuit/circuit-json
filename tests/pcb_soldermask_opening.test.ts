import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_soldermask_opening,
  type AnyCircuitElement,
  type PcbCircuitElement,
  type PcbSoldermaskOpening,
  type PcbSoldermaskOpeningInput,
} from "src"

const shapes = [
  { shape: "circle", x: -1, y: 2, radius: 0.5 },
  { shape: "rect", x: -1, y: 2, width: 3, height: 4 },
  {
    shape: "rotated_rect",
    x: -1,
    y: 2,
    width: 3,
    height: 4,
    ccw_rotation: 45,
  },
  {
    shape: "polygon",
    points: [
      { x: -1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
  },
] as const

test("a TSX contact-row coverlay window survives Circuit JSON round trips", () => {
  // Resolved output of <pcbsoldermaskopening> in a translated contact footprint.
  const window = {
    type: "pcb_soldermask_opening",
    pcb_soldermask_opening_id: "pcb_soldermask_opening_0",
    shape: "rect",
    layer: "top",
    x: 100,
    y: -68,
    width: 9,
    height: 6,
    pcb_component_id: "pcb_component_0",
    pcb_group_id: "pcb_group_0",
    subcircuit_id: "subcircuit_0",
  } satisfies PcbSoldermaskOpening
  const element: AnyCircuitElement = any_circuit_element.parse(
    JSON.parse(JSON.stringify(window)),
  )
  expect<unknown>(element).toEqual(window)
})

for (const layer of ["top", "bottom"] as const) {
  for (const shape of shapes) {
    test(`${layer} ${shape.shape} openings survive generic Circuit JSON parsing`, () => {
      const input = {
        type: "pcb_soldermask_opening",
        pcb_soldermask_opening_id: `opening_${layer}_${shape.shape}`,
        layer,
        ...shape,
      }
      const opening: PcbSoldermaskOpening = pcb_soldermask_opening.parse(input)
      const pcbElement: PcbCircuitElement = opening
      const circuitElement: AnyCircuitElement = pcbElement

      expect<unknown>(opening).toEqual(input)
      expect<unknown>(any_circuit_element.parse(circuitElement)).toEqual(input)
      expect(opening).not.toHaveProperty("pcb_component_id")
      expect(opening).not.toHaveProperty("source_net_id")
    })
  }
}

test("generates IDs and preserves optional ownership references", () => {
  const input: PcbSoldermaskOpeningInput = {
    type: "pcb_soldermask_opening",
    ...shapes[0],
    layer: "top",
    pcb_component_id: "pcb_component_1",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
  }
  const opening = pcb_soldermask_opening.parse(input)
  expect(opening).toMatchObject(input)
  expect(opening.pcb_soldermask_opening_id).toMatch(
    /^pcb_soldermask_opening_[A-Za-z0-9]+$/,
  )
  expect(any_circuit_element.parse(opening)).toEqual(opening)
})

test("normalizes distance, rotation, and layer reference inputs", () => {
  const opening = pcb_soldermask_opening.parse({
    type: "pcb_soldermask_opening",
    shape: "rotated_rect",
    layer: { name: "bottom" },
    x: "-2mm",
    y: "3mm",
    width: "1in",
    height: "5mm",
    ccw_rotation: `${Math.PI / 2}rad`,
  })
  expect(opening).toMatchObject({
    x: -2,
    y: 3,
    width: 25.4,
    height: 5,
    ccw_rotation: 90,
    layer: "bottom",
  })
  const polygon = pcb_soldermask_opening.parse({
    type: "pcb_soldermask_opening",
    shape: "polygon",
    layer: "top",
    points: [
      { x: "0mm", y: "0mm" },
      { x: "2mm", y: "0mm" },
      { x: "1mm", y: "1mm" },
    ],
  })
  expect(polygon).toMatchObject({
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
  })
})

test("rejects inner layers and missing or unknown sides", () => {
  for (const layer of ["inner1", { name: "inner2" }, "solder", undefined]) {
    expect(
      pcb_soldermask_opening.safeParse({
        type: "pcb_soldermask_opening",
        ...shapes[0],
        layer,
      }).success,
    ).toBe(false)
  }
})

test("rejects nonpositive sizes and nonfinite geometry", () => {
  const invalidShapes = [
    ...[0, -1, Infinity].map((radius) => ({ ...shapes[0], radius })),
    ...[0, -1, Infinity].flatMap((size) => [
      { ...shapes[1], width: size },
      { ...shapes[2], height: size },
    ]),
    { ...shapes[0], x: Infinity },
    { ...shapes[1], y: Number.NaN },
    { ...shapes[2], ccw_rotation: Infinity },
    { ...shapes[2], ccw_rotation: "invalid" },
    { ...shapes[3], points: [{ x: Infinity, y: 0 }, ...shapes[3].points] },
  ]
  for (const shape of invalidShapes) {
    expect(
      pcb_soldermask_opening.safeParse({
        type: "pcb_soldermask_opening",
        layer: "top",
        ...shape,
      }).success,
    ).toBe(false)
  }
})

test("requires the geometry for the selected shape", () => {
  for (const shape of [
    { shape: "circle", x: 0, y: 0 },
    { shape: "rect", x: 0, y: 0, width: 1 },
    { ...shapes[1], shape: "rotated_rect" },
    {
      shape: "polygon",
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    },
    { ...shapes[0], shape: "unsupported" },
  ]) {
    expect(
      any_circuit_element.safeParse({
        type: "pcb_soldermask_opening",
        layer: "top",
        ...shape,
      }).success,
    ).toBe(false)
  }
})

test("rejects incompatible shape geometry instead of silently discarding it", () => {
  const invalidShapes = [
    ...["width", "height", "ccw_rotation"].map((key) => ({
      ...shapes[0],
      [key]: 1,
    })),
    { ...shapes[0], points: shapes[3].points },
    { ...shapes[1], radius: 1 },
    { ...shapes[1], ccw_rotation: 45 },
    { ...shapes[1], points: shapes[3].points },
    { ...shapes[2], radius: 1 },
    { ...shapes[2], points: shapes[3].points },
    ...["x", "y", "width", "height", "radius", "ccw_rotation"].map((key) => ({
      ...shapes[3],
      [key]: 1,
    })),
  ]
  for (const shape of invalidShapes) {
    expect(
      any_circuit_element.safeParse({
        type: "pcb_soldermask_opening",
        layer: "bottom",
        ...shape,
      }).success,
    ).toBe(false)
  }
})

test("rejects zero-area polygon windows and accepts either boundary winding", () => {
  for (const points of [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1e308, y: 0 },
      { x: 0, y: 1e308 },
    ],
  ]) {
    expect(
      pcb_soldermask_opening.safeParse({
        type: "pcb_soldermask_opening",
        shape: "polygon",
        layer: "top",
        points,
      }).success,
    ).toBe(false)
  }
  for (const points of [
    shapes[3].points,
    [...shapes[3].points].reverse(),
    [...shapes[3].points, shapes[3].points[0]],
  ]) {
    const input = {
      type: "pcb_soldermask_opening",
      pcb_soldermask_opening_id: "pcb_soldermask_opening_polygon",
      shape: "polygon",
      layer: "top",
      points,
    }
    expect<unknown>(pcb_soldermask_opening.parse(input)).toEqual(input)
  }
})
