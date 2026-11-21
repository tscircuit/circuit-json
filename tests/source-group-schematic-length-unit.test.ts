import { expect, test } from "bun:test"
import {
  source_group,
  LEGACY_SCHEMATIC_LENGTH_UNIT,
  MM_PER_SCHEMATIC_UNIT,
} from "../src"

test("source groups preserve the schematic placement default and accept older documents", () => {
  const group = {
    type: "source_group",
    source_group_id: "board",
    is_subcircuit: true,
  }
  expect(source_group.parse(group)).toEqual(group)
  expect(LEGACY_SCHEMATIC_LENGTH_UNIT).toBe(`${MM_PER_SCHEMATIC_UNIT}mm`)
  for (const unit of ["mm", "in", LEGACY_SCHEMATIC_LENGTH_UNIT]) {
    const input = { ...group, default_schematic_length_unit: unit }
    expect(source_group.parse(input)).toEqual(input)
  }
  expect(
    source_group.safeParse({ ...group, default_schematic_length_unit: "feet" })
      .success,
  ).toBe(false)
})
