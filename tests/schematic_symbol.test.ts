import { expect, test } from "bun:test"
import { schematic_symbol } from "../src/schematic/schematic_symbol"

test("schematic_symbol accepts optional name", () => {
  const symbol = schematic_symbol.parse({
    type: "schematic_symbol",
    schematic_symbol_id: "sym_1",
    name: "opamp",
  })

  expect(symbol.name).toBe("opamp")
})

test("schematic_symbol does not require name", () => {
  const symbol = schematic_symbol.parse({
    type: "schematic_symbol",
    schematic_symbol_id: "sym_2",
  })

  expect(symbol.name).toBeUndefined()
})
