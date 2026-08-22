import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  type SchematicNoConnect,
  schematic_no_connect,
} from "../src/schematic/schematic_no_connect"

test("parses a schematic no-connect marker", () => {
  const input: SchematicNoConnect = {
    type: "schematic_no_connect",
    schematic_no_connect_id: "schematic_no_connect_1",
    schematic_sheet_id: "schematic_sheet_1",
    source_port_id: "source_port_1",
    center: { x: 4.5, y: -2 },
    subcircuit_id: "subcircuit_1",
  }

  expect(schematic_no_connect.parse(input)).toEqual(input)
  expect(any_circuit_element.parse(input)).toEqual(input)
})
