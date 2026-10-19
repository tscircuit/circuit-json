import { expect, test } from "bun:test"
import {
  any_circuit_element,
  getPcbLayerConductivity,
  pcb_board,
  pcb_stackup,
  pcb_trace,
  type PcbStackup,
} from "../src"

const stackup: PcbStackup = {
  source: "assumed",
  materials: { copper: { name: "Copper", conductivity_s_per_m: 58e6 } },
  layers: [
    {
      type: "copper",
      layer: "top",
      material_id: "copper",
      thickness_mm: 0.035,
    },
    { type: "dielectric", thickness_mm: 0.2 },
    {
      type: "copper",
      layer: "bottom",
      material_id: "copper",
      thickness_mm: 0.018,
    },
  ],
}

const makeBoard = (physical_stackup: PcbStackup = stackup) =>
  pcb_board.parse({
    type: "pcb_board",
    pcb_board_id: "pcb_board_1",
    center: { x: 0, y: 0 },
    num_layers: 2,
    stackup: physical_stackup,
  })

test("shared materials survive generic Circuit JSON round trips without copying conductivity onto layers", () => {
  const board = makeBoard()
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(board)))).toEqual(
    board,
  )
  for (const layer of ["top", "bottom"] as const) {
    expect(getPcbLayerConductivity(board, layer)).toBe(58e6)
  }
  expect(board.stackup).toEqual(stackup)
})

test("a routed trace inherits per wire layer, including a layer override across a via", () => {
  const board = makeBoard({
    ...stackup,
    layers: stackup.layers.map((layer) =>
      layer.type === "copper" && layer.layer === "bottom"
        ? { ...layer, conductivity_s_per_m: 55e6 }
        : layer,
    ),
  })
  const trace = pcb_trace.parse({
    type: "pcb_trace",
    pcb_trace_id: "pcb_trace_1",
    route: [
      { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" },
      { route_type: "wire", x: 10, y: 0, width: 0.2, layer: "top" },
      { route_type: "via", x: 10, y: 0, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 10, y: 0, width: 0.1, layer: "bottom" },
      { route_type: "wire", x: 20, y: 0, width: 0.1, layer: "bottom" },
    ],
  })
  expect(
    trace.route.flatMap((point) =>
      point.route_type === "wire"
        ? [getPcbLayerConductivity(board, point.layer)]
        : [],
    ),
  ).toEqual([58e6, 58e6, 55e6, 55e6])
  expect(board.stackup?.materials?.copper?.conductivity_s_per_m).toBe(58e6)
  expect(any_circuit_element.parse(trace)).toEqual(trace)
})

test("material IDs are scoped to the supplied board", () => {
  const first = makeBoard()
  const second = makeBoard({
    ...stackup,
    materials: { copper: { name: "Copper", conductivity_s_per_m: 56e6 } },
  })
  expect(getPcbLayerConductivity(first, "top")).toBe(58e6)
  expect(getPcbLayerConductivity(second, "top")).toBe(56e6)
})

test("missing conductivity stays unknown and existing explicit layer values still work", () => {
  const board = makeBoard({
    ...stackup,
    materials: { copper: { name: "Copper" } },
  })
  expect(getPcbLayerConductivity(board, "top")).toBeUndefined()
  expect(getPcbLayerConductivity(board, "inner1")).toBeUndefined()
  const legacy_board = pcb_board.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
  })
  expect(getPcbLayerConductivity(legacy_board, "top")).toBeUndefined()
  const explicit_board = makeBoard({
    source: "specified",
    layers: [
      { type: "copper", layer: "top", conductivity_s_per_m: 57e6 },
      { type: "dielectric" },
      { type: "copper", layer: "bottom" },
    ],
  })
  expect(getPcbLayerConductivity(explicit_board, "top")).toBe(57e6)
  expect(getPcbLayerConductivity(explicit_board, "bottom")).toBeUndefined()
})

test("unknown and inherited object-property material IDs are rejected at the reference", () => {
  for (const material_id of [
    "missing",
    "toString",
    "constructor",
    "__proto__",
  ]) {
    const result = pcb_stackup.safeParse({
      ...stackup,
      layers: [{ type: "copper", layer: "top", material_id }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["layers", 0, "material_id"])
    }
  }
})

test("material conductivity must be finite and positive, and names and IDs nonempty", () => {
  for (const conductivity of [0, -1, Number.NaN, Infinity, "58MS/m"]) {
    expect(
      pcb_stackup.safeParse({
        ...stackup,
        materials: {
          copper: { name: "Copper", conductivity_s_per_m: conductivity },
        },
      }).success,
    ).toBe(false)
  }
  for (const invalid of [
    { materials: { copper: { name: " " } } },
    { materials: { "": { name: "Copper" } } },
    { layers: [{ type: "copper", layer: "top", material_id: "" }] },
  ]) {
    expect(pcb_stackup.safeParse({ ...stackup, ...invalid }).success).toBe(
      false,
    )
  }
})

test("lookup rejects an inconsistent board layer count", () => {
  const board = makeBoard()
  board.num_layers = 4
  expect(() => getPcbLayerConductivity(board, "top")).toThrow(
    "stackup contains 2 copper layers",
  )
})
