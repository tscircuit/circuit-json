import { expect, test } from "bun:test"
import { any_circuit_element, cad_cable } from "../src"

const cable = {
  type: "cad_cable" as const,
  cad_cable_id: "cad_cable_1",
  name: "MOTOR_CABLE",
  from_source_component_id: "motor_1",
  to_source_component_id: "connector_1",
  cableprinter_string: "jst_ph_pins6",
  path: [
    { x: "12mm", y: 8, z: 20 },
    { x: 40, y: 15, z: 10 },
    { x: 60, y: 20, z: 3 },
  ],
}

test("cable routes survive the universal circuit schema with normalized millimeter points", () => {
  const parsed = any_circuit_element.parse(cable)
  expect(parsed).toEqual({
    ...cable,
    path: [
      { x: 12, y: 8, z: 20 },
      { x: 40, y: 15, z: 10 },
      { x: 60, y: 20, z: 3 },
    ],
  })
  expect(
    cad_cable.parse({
      ...cable,
      cad_cable_id: "cad_cable_2",
      name: "SECOND_CABLE",
      cableprinter_string: "usb_c",
    }).cad_cable_id,
  ).toBe("cad_cable_2")
})

test("cables reject incomplete, coincident and nonfinite paths or missing endpoint identities", () => {
  for (const path of [
    [],
    [cable.path[0]],
    [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ],
    [
      { x: 0, y: 0, z: 0 },
      { x: Infinity, y: 0, z: 0 },
    ],
  ]) {
    expect(cad_cable.safeParse({ ...cable, path }).success).toBe(false)
  }
  expect(
    cad_cable.safeParse({ ...cable, from_source_component_id: undefined })
      .success,
  ).toBe(false)
})

test("connector width directions survive parsing and reject non-unit or nonfinite vectors", () => {
  const oriented = {
    ...cable,
    from_connector_width_direction: { x: 0, y: 1, z: 0 },
    to_connector_width_direction: { x: 1, y: 0, z: 0 },
  }
  const parsed = any_circuit_element.parse(oriented)
  expect(parsed).toMatchObject({
    from_connector_width_direction: oriented.from_connector_width_direction,
    to_connector_width_direction: oriented.to_connector_width_direction,
  })
  for (const direction of [
    { x: 0, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: NaN, y: 0, z: 1 },
  ]) {
    expect(
      cad_cable.safeParse({
        ...cable,
        from_connector_width_direction: direction,
      }).success,
    ).toBe(false)
  }
})
