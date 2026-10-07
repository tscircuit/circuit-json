import { expect, test } from "bun:test"
import { any_circuit_element, cad_cable } from "../src"

test("cable pin 1 positions preserve absolute coordinates, normalize units and remain optional", () => {
  const cable = {
    type: "cad_cable" as const,
    cad_cable_id: "cable_1",
    name: "MOTOR_CABLE",
    from_source_component_id: "motor_1",
    to_source_component_id: "connector_1",
    cableprinter_string: "jst_ph_pins6",
    path: [
      { x: 10, y: 20, z: 30 },
      { x: 40, y: 50, z: 60 },
    ],
  }
  expect(cad_cable.parse(cable)).toEqual(cable)
  const oriented = {
    ...cable,
    from_connector_pin1_position: { x: "5mm", y: 20, z: 23.15 },
    to_connector_pin1_position: { x: 40, y: "4.5cm", z: 66.85 },
  }
  expect(any_circuit_element.parse(oriented)).toMatchObject({
    from_connector_pin1_position: { x: 5, y: 20, z: 23.15 },
    to_connector_pin1_position: { x: 40, y: 45, z: 66.85 },
  })
  // Points need not be unit length or relative to the world origin.
  expect(
    cad_cable.safeParse({
      ...cable,
      from_connector_pin1_position: { x: 0, y: 0, z: 0 },
    }).success,
  ).toBe(true)
  for (const field of [
    "from_connector_pin1_position",
    "to_connector_pin1_position",
  ]) {
    for (const point of [
      { x: Infinity, y: 0, z: 0 },
      { x: 0, y: NaN, z: 0 },
      { x: 1, y: 2 },
    ]) {
      expect(cad_cable.safeParse({ ...cable, [field]: point }).success).toBe(
        false,
      )
    }
  }
})
