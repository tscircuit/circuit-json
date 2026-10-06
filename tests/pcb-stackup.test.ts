import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_board,
  pcb_stackup,
  validatePcbBoardStackup,
  type PcbStackup,
  type PcbStackupLayer,
  type LayerRef,
} from "../src"

// Nominal construction from https://jlcpcb.com/impedance; Er frequency/core product remain unspecified.
const specified_stackup: PcbStackup = {
  source: "specified",
  manufacturer: "JLCPCB",
  manufacturer_stackup_id: "JLC04161H-7628",
  source_url: "https://jlcpcb.com/impedance",
  layers: [
    { type: "copper", layer: "top", thickness_mm: 0.035 },
    {
      type: "dielectric",
      dielectric_type: "prepreg",
      material: "7628*1",
      thickness_mm: 0.2104,
      dielectric_constant: 4.4,
    },
    { type: "copper", layer: "inner1", thickness_mm: 0.0152 },
    {
      type: "dielectric",
      dielectric_type: "core",
      thickness_mm: 1.065,
      dielectric_constant: 4.6,
    },
    { type: "copper", layer: "inner2", thickness_mm: 0.0152 },
    {
      type: "dielectric",
      dielectric_type: "prepreg",
      material: "7628*1",
      thickness_mm: 0.2104,
      dielectric_constant: 4.4,
    },
    { type: "copper", layer: "bottom", thickness_mm: 0.035 },
  ],
}

function getAssumedStackup(copper_layers: LayerRef[]): PcbStackup {
  const layers: PcbStackupLayer[] = []
  for (const layer of copper_layers) {
    if (layers.length > 0) layers.push({ type: "dielectric" })
    layers.push({ type: "copper", layer })
  }
  return { source: "assumed", layers }
}

test("specified catalog stackup survives board and generic JSON parsing", () => {
  const input = {
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    num_layers: 4,
    thickness: 1.6,
    material: "fr4",
    stackup: specified_stackup,
  }
  const board = pcb_board.parse(input)
  expect(board.stackup).toEqual(specified_stackup)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(board)))).toEqual(
    board,
  )
  expect(() => validatePcbBoardStackup(board)).not.toThrow()
})

const copper_orders: LayerRef[][] = [
  ["top"],
  ["top", "bottom"],
  ["top", "inner1", "inner2", "bottom"],
  ["top", "inner1", "inner2", "inner3", "inner4", "bottom"],
  ["top", "inner1", "inner2", "inner3", "inner4", "inner5", "inner6", "bottom"],
  [
    "top",
    "inner1",
    "inner2",
    "inner3",
    "inner4",
    "inner5",
    "inner6",
    "inner7",
    "inner8",
    "bottom",
  ],
]

for (const copper_layers of copper_orders) {
  test(`${copper_layers.length}-layer order preserves unknown physical quantities`, () => {
    const stackup = getAssumedStackup(copper_layers)
    const board = pcb_board.parse({
      type: "pcb_board",
      center: { x: 0, y: 0 },
      num_layers: copper_layers.length,
      material: "fr4",
      stackup,
    })
    expect(board.stackup).toEqual(stackup)
    expect(() => validatePcbBoardStackup(board)).not.toThrow()
  })
}

test("multiple prepreg sublayers and a frequency-qualified Er are supported", () => {
  const stackup: PcbStackup = {
    source: "specified",
    layers: [
      { type: "copper", layer: "top" },
      { type: "dielectric", dielectric_type: "prepreg", material: "1080" },
      {
        type: "dielectric",
        dielectric_type: "prepreg",
        material: "2116",
        dielectric_constant: 4.1,
        dielectric_constant_frequency_hz: 1e9,
      },
      { type: "copper", layer: "bottom" },
    ],
  }
  expect(pcb_stackup.parse(stackup)).toEqual(stackup)
})

test("legacy boards keep their defaults and schema composition API", () => {
  const board = pcb_board.extend({}).parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
  })
  expect(board.stackup).toBeUndefined()
  expect(board.num_layers).toBe(4)
  expect(board.thickness).toBe(1.4)
  expect(board.material).toBe("fr4")
  expect(() => validatePcbBoardStackup(board)).not.toThrow()
})

test("board consistency check catches explicit and defaulted layer-count mismatches", () => {
  const stackup = getAssumedStackup(copper_orders[3]!)
  for (const num_layers of [undefined, 2, 8]) {
    const board = pcb_board.parse({
      type: "pcb_board",
      pcb_board_id: "pcb_board_six_layers",
      center: { x: 0, y: 0 },
      num_layers,
      stackup,
    })
    expect(() => validatePcbBoardStackup(board)).toThrow(
      `Board pcb_board_six_layers: num_layers is ${num_layers ?? 4}, but stackup contains 6 copper layers`,
    )
  }
})

test("stackups stay scoped to their own board and subcircuit", () => {
  const boards = [
    {
      pcb_board_id: "pcb_board_a",
      subcircuit_id: "subcircuit_a",
      stackup: specified_stackup,
    },
    {
      pcb_board_id: "pcb_board_b",
      subcircuit_id: "subcircuit_b",
      stackup: getAssumedStackup(copper_orders[2]!),
    },
    { pcb_board_id: "pcb_board_c", subcircuit_id: "subcircuit_c" },
  ].map((board) =>
    any_circuit_element.parse({
      type: "pcb_board",
      center: { x: 0, y: 0 },
      num_layers: 4,
      ...board,
    }),
  )
  expect(
    boards.map((board) => board.type === "pcb_board" && board.stackup),
  ).toEqual([
    specified_stackup,
    getAssumedStackup(copper_orders[2]!),
    undefined,
  ])
})

test("invalid physical order reports the offending layer", () => {
  for (const copper_layers of [
    ["bottom", "top"],
    ["top", "inner2", "inner1", "bottom"],
    ["top", "inner1", "inner1", "bottom"],
    ["top", "inner2", "bottom"],
    ["top", "inner1"],
  ] satisfies LayerRef[][]) {
    const result = pcb_stackup.safeParse(getAssumedStackup(copper_layers))
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path[0] === "layers" &&
            issue.path[2] === "layer" &&
            issue.message.includes("Expected copper layer"),
        ),
      ).toBe(true)
    }
  }
})

test("missing separators, exterior dielectrics, and empty stackups are rejected", () => {
  for (const layers of [
    [],
    [{ type: "dielectric" }],
    [
      { type: "copper", layer: "top" },
      { type: "copper", layer: "bottom" },
    ],
    [{ type: "dielectric" }, { type: "copper", layer: "top" }],
    [{ type: "copper", layer: "top" }, { type: "dielectric" }],
  ]) {
    expect(pcb_stackup.safeParse({ source: "assumed", layers }).success).toBe(
      false,
    )
  }
})

test("stackup dimensions accept only finite positive numbers in explicit units", () => {
  for (const invalid_quantity of [0, -1, Number.NaN, Infinity, "35um", "1oz"]) {
    for (const property of [
      "thickness_mm",
      "dielectric_constant",
      "dielectric_constant_frequency_hz",
    ]) {
      expect(
        pcb_stackup.safeParse({
          source: "specified",
          layers: [
            { type: "copper", layer: "top" },
            {
              type: "dielectric",
              dielectric_constant: 4.1,
              [property]: invalid_quantity,
            },
            { type: "copper", layer: "bottom" },
          ],
        }).success,
      ).toBe(false)
    }
    expect(
      pcb_stackup.safeParse({
        source: "specified",
        layers: [
          { type: "copper", layer: "top", thickness_mm: invalid_quantity },
        ],
      }).success,
    ).toBe(false)
  }
})

test("provenance and frequency metadata cannot be incomplete", () => {
  for (const stackup of [
    { layers: [{ type: "copper", layer: "top" }] },
    { source: "verified", layers: [{ type: "copper", layer: "top" }] },
    {
      source: "specified",
      manufacturer_stackup_id: "4L-01",
      layers: [{ type: "copper", layer: "top" }],
    },
    {
      source: "specified",
      source_url: "not a URL",
      layers: [{ type: "copper", layer: "top" }],
    },
    {
      source: "specified",
      layers: [
        { type: "copper", layer: "top" },
        { type: "dielectric", dielectric_constant_frequency_hz: 1e9 },
        { type: "copper", layer: "bottom" },
      ],
    },
  ]) {
    expect(pcb_stackup.safeParse(stackup).success).toBe(false)
  }
})
