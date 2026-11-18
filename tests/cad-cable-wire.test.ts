import { expect, test } from "bun:test"
import { any_circuit_element, cad_cable, cad_cable_wire } from "../src"

const cable = {
  type: "cad_cable" as const,
  cad_cable_id: "cad_cable_1",
  name: "MOTOR_CABLE",
  from_source_component_id: "motor_1",
  to_source_component_id: "connector_1",
  cableprinter_string: "adaptercable_a(jst_ph_pins6)_b(jst_ph_pins4)",
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 50, y: 0, z: 0 },
  ],
}

test("cables carry a build length and per-wire pin mapping between unequal connectors", () => {
  expect(
    any_circuit_element.parse({
      ...cable,
      nominal_length: "50mm",
      length_tolerance: 3,
      from_connector_name: " H1 ",
      to_connector_name: "H2",
    }),
  ).toEqual({
    ...cable,
    nominal_length: 50,
    length_tolerance: 3,
    from_connector_name: "H1",
    to_connector_name: "H2",
  })
  expect(cad_cable.parse(cable)).toEqual(cable)
  for (const invalid of [
    { length_tolerance: 3 },
    { nominal_length: 0 },
    { nominal_length: 50, length_tolerance: -1 },
    { from_connector_name: " " },
  ])
    expect(cad_cable.safeParse({ ...cable, ...invalid }).success).toBe(false)

  const wire = {
    type: "cad_cable_wire" as const,
    cad_cable_wire_id: "wire_4",
    cad_cable_id: "cad_cable_1",
    from_pin_number: 4,
    to_pin_number: 2,
    color: "black",
    wire_awg: 22,
    wire_style: "UL1007",
    name: "B+",
  }
  expect(any_circuit_element.parse(wire)).toEqual(wire)
  expect(
    cad_cable_wire.parse({
      type: "cad_cable_wire",
      cad_cable_wire_id: "wire_1",
      cad_cable_id: "cad_cable_1",
      from_pin_number: 1,
      to_pin_number: 1,
    }).color,
  ).toBeUndefined()
  for (const invalid of [
    { from_pin_number: 0 },
    { to_pin_number: 1.5 },
    { to_pin_number: "pin2" },
    { cad_cable_id: "" },
    { color: " " },
    { wire_awg: -2 },
  ])
    expect(cad_cable_wire.safeParse({ ...wire, ...invalid }).success).toBe(
      false,
    )
})
