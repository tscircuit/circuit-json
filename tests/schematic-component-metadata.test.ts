import { expect, test } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

test("schematic components preserve and validate KiCad metadata without a custom symbol", () => {
  const schematicComponent = {
    type: "schematic_component",
    schematic_component_id: "schematic_component_1",
    source_component_id: "source_component_1",
    center: { x: 0, y: 0 },
    size: { width: 0.4, height: 1 },
  }
  const metadata = {
    kicad_symbol: {
      properties: {
        Value: { value: "MyPart" },
        Max_Current_A: { value: "6.4", effects: { hide: true } },
      },
    },
    custom_exporter: { version: 1 },
  }
  const parsed = schematic_component.parse({ ...schematicComponent, metadata })
  expect(parsed).toMatchObject({ ...schematicComponent, metadata })
  expect(schematic_component.parse(schematicComponent)).not.toHaveProperty(
    "metadata",
  )
  expect(parsed).not.toHaveProperty("schematic_symbol_id")
  expect(
    schematic_component.safeParse({
      ...schematicComponent,
      metadata: {
        kicad_symbol: { properties: { Max_Current_A: { value: 6.4 } } },
      },
    }).success,
  ).toBe(false)
})
