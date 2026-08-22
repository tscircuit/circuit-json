import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { type NoErc, no_erc } from "../src/schematic/no_erc"

test("parses a no ERC directive", () => {
  const input: NoErc = {
    type: "no_erc",
    no_erc_id: "no_erc_1",
    schematic_sheet_id: "schematic_sheet_1",
    source_port_id: "source_port_1",
    center: { x: 4.5, y: -2 },
    subcircuit_id: "subcircuit_1",
  }

  expect(no_erc.parse(input)).toEqual(input)
  expect(any_circuit_element.parse(input)).toEqual(input)
})
