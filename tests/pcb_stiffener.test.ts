import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_stiffener,
  pcb_stiffener_rect,
  pcb_stiffener_polygon,
  type PcbStiffenerInput,
  type PcbStiffener,
  type PcbCircuitElement,
} from "src"

const rect = {
  type: "pcb_stiffener",
  pcb_board_id: "pcb_board_1",
  name: "S1",
  shape: "rect",
  center: { x: "2cm", y: -2 },
  rotation: "90deg",
  width: "12mm",
  height: "1cm",
  layer: "bottom",
  material: "fr4",
  thickness: "0.4mm",
  adhesive_thickness: "0.05mm",
} satisfies PcbStiffenerInput
const polygon = {
  type: "pcb_stiffener",
  pcb_board_id: "pcb_board_1",
  shape: "polygon",
  outline: [
    { x: 0, y: 0 },
    { x: "1cm", y: 0 },
    { x: 0, y: "5mm" },
  ],
  layer: "top",
  material: "polyimide",
  thickness: 0.2,
} satisfies PcbStiffenerInput

test("rect stiffener normalizes geometry, preserves metadata and joins element unions", () => {
  const stiffener: PcbStiffener = pcb_stiffener.parse({
    ...rect,
    pcb_stiffener_id: "pcb_stiffener_1",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
  })
  const element: PcbCircuitElement = stiffener
  expect(stiffener).toMatchObject({
    center: { x: 20, y: -2 },
    rotation: 90,
    width: 12,
    height: 10,
    thickness: 0.4,
    adhesive_thickness: 0.05,
    pcb_stiffener_id: "pcb_stiffener_1",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
  })
  expect(any_circuit_element.parse(element)).toEqual(stiffener)
  if (stiffener.shape !== "rect") throw new Error("Expected rectangle")
  expect(pcb_stiffener_rect.parse(stiffener)).toEqual(stiffener)
})

test("polygon stiffener normalizes resolved vertices and round trips through JSON", () => {
  const stiffener = pcb_stiffener.parse(polygon)
  expect(stiffener.pcb_stiffener_id).toMatch(/^pcb_stiffener_/)
  expect(stiffener).toMatchObject({
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 5 },
    ],
  })
  if (stiffener.shape !== "polygon") throw new Error("Expected polygon")
  expect(stiffener.adhesive_thickness).toBeUndefined()
  expect(any_circuit_element.parse(stiffener)).toEqual(stiffener)
  expect(
    pcb_stiffener_polygon.parse(JSON.parse(JSON.stringify(stiffener))),
  ).toEqual(stiffener)
  expect(
    pcb_stiffener.safeParse({
      ...polygon,
      outline: [...polygon.outline].reverse(),
    }).success,
  ).toBe(true)
})

test("stiffener requires board, geometry and explicit material/face/thickness", () => {
  for (const key of [
    "pcb_board_id",
    "shape",
    "layer",
    "material",
    "thickness",
    "center",
    "width",
    "height",
  ] as const) {
    expect(pcb_stiffener.safeParse({ ...rect, [key]: undefined }).success).toBe(
      false,
    )
  }
  expect(
    pcb_stiffener.safeParse({ ...polygon, outline: undefined }).success,
  ).toBe(false)
  for (const layer of ["inner1", "both", "wrong"]) {
    expect(pcb_stiffener.safeParse({ ...rect, layer }).success).toBe(false)
  }
  expect(
    pcb_stiffener.safeParse({ ...rect, material: "unknown" }).success,
  ).toBe(false)
  expect(pcb_stiffener.safeParse({ ...rect, shape: "circle" }).success).toBe(
    false,
  )
  for (const material of ["fr4", "polyimide", "stainless_steel", "aluminum"]) {
    expect(pcb_stiffener.safeParse({ ...rect, material }).success).toBe(true)
  }
  expect(
    pcb_stiffener_rect.parse({ ...rect, rotation: undefined }).rotation,
  ).toBeUndefined()
})

test("stiffener rejects nonphysical dimensions and nonfinite position/rotation", () => {
  for (const key of ["width", "height", "thickness"] as const) {
    for (const value of [0, "0mm", -1, "-1mm", Infinity, NaN]) {
      expect(pcb_stiffener.safeParse({ ...rect, [key]: value }).success).toBe(
        false,
      )
    }
  }
  for (const adhesive_thickness of [-1, "-1mm", Infinity, NaN]) {
    expect(
      pcb_stiffener.safeParse({ ...rect, adhesive_thickness }).success,
    ).toBe(false)
  }
  expect(
    pcb_stiffener.parse({ ...rect, adhesive_thickness: 0 }).adhesive_thickness,
  ).toBe(0)
  for (const value of [Infinity, -Infinity, NaN]) {
    expect(pcb_stiffener.safeParse({ ...rect, rotation: value }).success).toBe(
      false,
    )
    for (const axis of ["x", "y"] as const) {
      expect(
        pcb_stiffener.safeParse({
          ...rect,
          center: { ...rect.center, [axis]: value },
        }).success,
      ).toBe(false)
    }
  }
})

test("stiffener rejects conflicting local and resolved geometry", () => {
  expect(
    pcb_stiffener.safeParse({ ...rect, outline: polygon.outline }).success,
  ).toBe(false)
  for (const [key, value] of Object.entries({
    width: 10,
    height: 5,
    center: { x: 0, y: 0 },
    rotation: 0,
  })) {
    expect(pcb_stiffener.safeParse({ ...polygon, [key]: value }).success).toBe(
      false,
    )
  }
})

test("stiffener rejects underspecified, degenerate and nonfinite outlines", () => {
  for (const outline of [
    [],
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: Infinity, y: 0 },
      { x: 0, y: 5 },
    ],
  ]) {
    expect(pcb_stiffener.safeParse({ ...polygon, outline }).success).toBe(false)
  }
})
