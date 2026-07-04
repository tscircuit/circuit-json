import { test, expect } from "bun:test"
import { source_refdes_convention_warning } from "../src/source/source_refdes_convention_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_refdes_convention_warning parses", () => {
  const warning = source_refdes_convention_warning.parse({
    type: "source_refdes_convention_warning",
    message:
      'Component C1 has ftype="simple_resistor" but reference designator should start with R',
    source_component_id: "source_component_0",
    refdes: "C1",
    source_component_ftype: "simple_resistor",
    expected_prefixes: ["R"],
    actual_prefix: "C",
  })

  expect(warning.source_refdes_convention_warning_id).toBeDefined()
  expect(
    warning.source_refdes_convention_warning_id.startsWith(
      "source_refdes_convention_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_refdes_convention_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_refdes_convention_warning",
    message:
      'Component C1 has ftype="simple_resistor" but reference designator should start with R',
    source_component_id: "source_component_0",
    refdes: "C1",
    source_component_ftype: "simple_resistor",
    expected_prefixes: ["R"],
    actual_prefix: "C",
  })

  expect(parsed.type).toBe("source_refdes_convention_warning")
})
