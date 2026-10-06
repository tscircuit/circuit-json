import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_component_availability_warning,
} from "../src"

test("availability warnings retain supplier alternatives and component references", () => {
  const warning = source_component_availability_warning.parse({
    type: "source_component_availability_warning",
    message: "R1 may not have availability from JLCPCB (C1525, C2040).",
    source_component_id: "source_component_0",
    subcircuit_id: "subcircuit_0",
    supplier_name: "jlcpcb",
    supplier_part_numbers: ["C1525", "C2040"],
  })
  expect(warning.source_component_availability_warning_id).toStartWith(
    "source_component_availability_warning",
  )
  expect(warning.warning_type).toBe("source_component_availability_warning")
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(
    source_component_availability_warning.safeParse({
      ...warning,
      supplier_part_numbers: [],
    }).success,
  ).toBe(false)
  expect(
    source_component_availability_warning.safeParse({
      ...warning,
      source_component_id: undefined,
    }).success,
  ).toBe(false)
})
