import { expect, test } from "bun:test"
import {
  convertSchematicLengthUnits,
  LEGACY_SCHEMATIC_LENGTH_UNIT,
  type CircuitJson,
} from "../src"

test("inch and mm trace geometry converts per owner without changing physical paper dimensions", () => {
  const document: CircuitJson = [
    {
      type: "source_group",
      source_group_id: "g1",
      is_subcircuit: true,
      subcircuit_id: "outer",
      default_schematic_length_unit: "mm",
    },
    {
      type: "source_group",
      source_group_id: "g2",
      is_subcircuit: true,
      subcircuit_id: "inner",
      parent_subcircuit_id: "outer",
      default_schematic_length_unit: "in",
    },
    {
      type: "schematic_sheet",
      schematic_sheet_id: "s1",
      subcircuit_id: "outer",
      center: { x: 25.4, y: 0 },
      sheet_width: 100,
    },
    {
      type: "schematic_trace",
      schematic_trace_id: "t1",
      subcircuit_id: "inner",
      edges: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, is_crossing: true }],
      junctions: [{ x: 1, y: 0 }],
    },
  ]
  const converted = convertSchematicLengthUnits(
    document,
    LEGACY_SCHEMATIC_LENGTH_UNIT,
  )
  expect(converted[2]).toMatchObject({
    center: { x: 2.75, y: 0 },
    sheet_width: 100,
  })
  expect(converted[3]).toMatchObject({
    edges: [{ from: { x: 0, y: 0 }, to: { x: 2.75, y: 0 }, is_crossing: true }],
    junctions: [{ x: 2.75, y: 0 }],
  })
  expect(
    convertSchematicLengthUnits(converted, LEGACY_SCHEMATIC_LENGTH_UNIT),
  ).toBe(converted)
  expect(document[3]).toMatchObject({ junctions: [{ x: 1, y: 0 }] })
})
