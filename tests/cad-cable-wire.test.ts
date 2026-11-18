import { expect, test } from "bun:test"
import { any_circuit_element, cad_cable_wire } from "../src"

test("cable wires map one contact at each end and reject invalid pins and attributes", () => {
  const wire = {
    type: "cad_cable_wire" as const,
    cad_cable_wire_id: "wire_4",
    cad_cable_id: "cad_cable_1",
    from_pin_number: 4,
    to_pin_number: 2,
    color: "black",
    wire_awg: 22,
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
