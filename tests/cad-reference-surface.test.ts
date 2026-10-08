import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_reference_surface,
  type CadReferenceSurface,
  type CircuitJson,
} from "../src"

const surface: CadReferenceSurface = {
  type: "cad_reference_surface",
  cad_reference_surface_id: "cad_reference_surface_1",
  source_component_id: "source_stem",
  name: "shade",
  shape: "rect",
  center: { x: 0, y: 0, z: 92 },
  normal: { x: 0, y: 0, z: 1 },
  x_axis: { x: 1, y: 0, z: 0 },
}

test("reference surfaces round-trip through Circuit JSON with optional rectangular extents", () => {
  const circuit: CircuitJson = [surface]
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(circuit[0]))),
  ).toEqual(surface)
  expect(
    cad_reference_surface.parse({
      ...surface,
      center: { x: "3mm", y: "-2mm", z: "92mm" },
      width: "14mm",
      height: "10mm",
      subcircuit_id: "sub_1",
    }),
  ).toEqual({
    ...surface,
    center: { x: 3, y: -2, z: 92 },
    width: 14,
    height: 10,
    subcircuit_id: "sub_1",
  })
  const parsed = cad_reference_surface.parse(surface)
  expect(parsed).not.toHaveProperty("width")
  expect(parsed).not.toHaveProperty("height")
})

test("reference frames preserve tilted and reversed normals without inferring a world axis plane", () => {
  const s = Math.SQRT1_2
  const tilted = {
    ...surface,
    normal: { x: s, y: 0, z: s },
    x_axis: { x: 0, y: 1, z: 0 },
  }
  expect(any_circuit_element.parse(tilted)).toEqual(tilted)
  const reversed = { ...surface, normal: { x: 0, y: 0, z: -1 } }
  expect(cad_reference_surface.parse(reversed)).toEqual(reversed)
  expect(
    cad_reference_surface.safeParse({
      ...tilted,
      normal: { x: 0.70710677, y: 0, z: 0.70710677 },
    }).success,
  ).toBe(true)
})

test("reference surfaces reject invalid dimensions, frames, and missing identity", () => {
  for (const overrides of [
    { cad_reference_surface_id: undefined },
    { cad_reference_surface_id: "" },
    { source_component_id: undefined },
    { source_component_id: "" },
    { name: " " },
    { shape: "circle" },
    { center: { x: Infinity, y: 0, z: 0 } },
    { normal: { x: 0, y: 0, z: 0 } },
    { normal: { x: 0, y: 0, z: 2 } },
    { normal: { x: 0, y: 0, z: "1mm" } },
    { normal: { x: NaN, y: 0, z: 1 } },
    { x_axis: { x: 0, y: 0, z: 1 } },
    { x_axis: { x: 1, y: 0, z: Infinity } },
    { width: 10 },
    { height: 10 },
    { width: 0, height: 10 },
    { width: 10, height: -1 },
    { width: Infinity, height: 10 },
  ])
    expect(
      cad_reference_surface.safeParse({ ...surface, ...overrides }).success,
    ).toBe(false)
  expect(
    any_circuit_element.safeParse({ ...surface, x_axis: surface.normal })
      .success,
  ).toBe(false)
})
