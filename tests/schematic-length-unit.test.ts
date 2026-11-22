import { expect, test } from "bun:test"
import {
  any_circuit_element,
  type CircuitJson,
  source_group,
  LEGACY_SCHEMATIC_LENGTH_UNIT,
  MM_PER_SCHEMATIC_UNIT,
} from "../src"

test("source groups preserve the schematic placement default and accept older documents", () => {
  const group = {
    type: "source_group" as const,
    source_group_id: "board",
    is_subcircuit: true,
  }
  expect(source_group.parse(group)).toEqual(group)
  expect(LEGACY_SCHEMATIC_LENGTH_UNIT).toBe(`${MM_PER_SCHEMATIC_UNIT}mm`)
  for (const unit of ["mm", "in", LEGACY_SCHEMATIC_LENGTH_UNIT] as const) {
    const input = { ...group, default_schematic_length_unit: unit }
    expect(source_group.parse(input)).toEqual(input)
  }
  expect(
    source_group.safeParse({ ...group, default_schematic_length_unit: "feet" })
      .success,
  ).toBe(false)
})

test("a detached trace preserves its nested geometry and optional unit", () => {
  const trace = {
    type: "schematic_trace" as const,
    schematic_trace_id: "trace",
    edges: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }],
    junctions: [{ x: 1, y: 0 }],
  }
  expect(any_circuit_element.parse(trace)).toEqual(trace)
  for (const unit of ["in", "mm", LEGACY_SCHEMATIC_LENGTH_UNIT] as const) {
    const tagged = { ...trace, schematic_length_unit: unit }
    expect(any_circuit_element.parse(tagged)).toEqual(tagged)
  }
  expect(
    any_circuit_element.safeParse({ ...trace, schematic_length_unit: "cm" })
      .success,
  ).toBe(false)
})

test("a subcircuit default coexists with inch and untagged geometry", () => {
  const records: CircuitJson = [
    {
      type: "source_group",
      source_group_id: "g",
      is_subcircuit: true,
      subcircuit_id: "board",
      default_schematic_length_unit: "mm",
    },
    {
      type: "schematic_sheet",
      schematic_sheet_id: "sheet",
      subcircuit_id: "board",
      schematic_length_unit: "in",
      center: { x: 1, y: 0 },
      sheet_width: 215.9,
    },
    {
      type: "schematic_debug_object",
      shape: "point",
      subcircuit_id: "board",
      center: { x: 2.75, y: 0 },
    },
    {
      type: "source_failed_to_create_component_error",
      error_type: "source_failed_to_create_component_error",
      source_failed_to_create_component_error_id: "err",
      message: "Missing component",
      schematic_length_unit: "in",
      schematic_center: { x: 1 },
      pcb_center: { x: 25.4 },
    },
  ]
  expect(any_circuit_element.array().parse(records)).toEqual(records)
})
