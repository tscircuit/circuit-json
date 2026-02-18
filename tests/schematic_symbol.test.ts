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

test("schematic_symbol accepts optional kicad_symbol_metadata", () => {
  const symbol = schematic_symbol.parse({
    type: "schematic_symbol",
    schematic_symbol_id: "sym_3",
    kicad_symbol_metadata: {
      symbolName: "Amplifier_Operational:AD8603",
      pinNumbers: { hide: false },
      pinNames: { offset: "1.27" },
      properties: {
        Reference: { value: "U", id: 0 },
        Footprint: { value: "Package_SO:SOIC-8_3.9x4.9mm_P1.27mm" },
      },
    },
  })

  expect(symbol.kicad_symbol_metadata?.symbolName).toBe(
    "Amplifier_Operational:AD8603",
  )
  expect(symbol.kicad_symbol_metadata?.pinNames?.offset).toBe(1.27)
})
