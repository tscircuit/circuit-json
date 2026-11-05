import { pcb_component } from "../src/pcb/pcb_component"
import { schematic_symbol } from "../src/schematic/schematic_symbol"
import { expect, test } from "bun:test"
import {
  kicadFootprintMetadata,
  type KicadFootprintMetadata,
} from "../src/common/kicadFootprintMetadata"
import {
  kicadSymbolMetadata,
  type KicadSymbolMetadata,
} from "../src/common/kicadSymbolMetadata"

const footprintMetadata = {
  properties: {
    Value: { value: "MyPart" },
    Max_Current_A: {
      value: "6.4",
      hide: true,
      at: { x: 2, y: 3, rotation: 90 },
      layer: "F.Fab",
      uuid: "custom-property-uuid",
      effects: { font: { size: { x: 1, y: 1 }, thickness: 0.15 } },
    },
    Empty: { value: "" },
  },
} satisfies KicadFootprintMetadata

const symbolMetadata = {
  properties: {
    Value: { value: "MyPart" },
    Max_Current_A: {
      value: "6.4",
      id: "7",
      at: { x: 2, y: 3, rotation: 90 },
      effects: {
        hide: true,
        justify: ["left", "bottom"],
        font: { size: { x: 1, y: 1 }, thickness: 0.15 },
      },
    },
    Empty: { value: "" },
  },
} satisfies KicadSymbolMetadata

test("footprint metadata preserves and validates arbitrary property names", () => {
  const parsed = kicadFootprintMetadata.parse(footprintMetadata)
  expect(parsed.properties?.Value).toEqual({ value: "MyPart" })
  expect(parsed.properties?.Max_Current_A).toEqual({
    ...footprintMetadata.properties?.Max_Current_A,
    at: { x: 2, y: 3, rotation: 90 },
    effects: { font: { size: { x: 1, y: 1 }, thickness: 0.15 } },
  })
  expect(parsed.properties?.Empty).toEqual({ value: "" })
})

test("symbol metadata preserves and validates arbitrary property names", () => {
  const parsed = kicadSymbolMetadata.parse(symbolMetadata)
  expect(parsed.properties?.Value).toEqual({ value: "MyPart" })
  expect(parsed.properties?.Max_Current_A).toEqual({
    ...symbolMetadata.properties?.Max_Current_A,
    at: { x: 2, y: 3, rotation: 90 },
    effects: {
      hide: true,
      justify: ["left", "bottom"],
      font: { size: { x: 1, y: 1 }, thickness: 0.15 },
    },
  })
  expect(parsed.properties?.Empty).toEqual({ value: "" })
})

for (const schema of [kicadFootprintMetadata, kicadSymbolMetadata]) {
  test(`${schema === kicadFootprintMetadata ? "footprint" : "symbol"} custom properties reject malformed inputs`, () => {
    for (const property of [
      null,
      "6.4",
      {},
      { value: 6.4 },
      { value: "6.4", effects: { font: { size: { x: false, y: 1 } } } },
    ]) {
      const parsed = schema.safeParse({
        properties: { Max_Current_A: property },
      })
      expect(parsed.success).toBe(false)
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain("Max_Current_A")
      }
    }
    expect(schema.parse({})).toEqual({})
    expect(schema.parse({ properties: {} })).toEqual({ properties: {} })
  })
}

test("component metadata survives Circuit JSON parsing", () => {
  const pcbComponent = pcb_component.parse({
    type: "pcb_component",
    pcb_component_id: "pcb_component_1",
    source_component_id: "source_component_1",
    center: { x: 0, y: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    layer: "top",
    metadata: { kicad_footprint: footprintMetadata },
  })
  expect(
    pcbComponent.metadata?.kicad_footprint?.properties?.Max_Current_A?.value,
  ).toBe("6.4")
  const schematicSymbol = schematic_symbol.parse({
    type: "schematic_symbol",
    schematic_symbol_id: "schematic_symbol_1",
    metadata: { kicad_symbol: symbolMetadata },
  })
  expect(
    schematicSymbol.metadata?.kicad_symbol?.properties?.Max_Current_A?.value,
  ).toBe("6.4")
})

test("built-in properties stay named and validated alongside custom properties", () => {
  for (const [schema, propertyNames] of [
    [
      kicadFootprintMetadata,
      ["Reference", "Value", "Datasheet", "Description"],
    ],
    [
      kicadSymbolMetadata,
      [
        "Reference",
        "Value",
        "Footprint",
        "Datasheet",
        "Description",
        "ki_keywords",
        "ki_fp_filters",
      ],
    ],
  ] as const) {
    const properties = Object.fromEntries(
      propertyNames.map((propertyName) => [
        propertyName,
        { value: String(propertyName) },
      ]),
    )
    properties.Max_Current_A = { value: "6.4" }
    expect(schema.parse({ properties }).properties).toEqual(properties)
    expect(Object.keys(schema.shape.properties.unwrap().shape)).toEqual([
      ...propertyNames,
    ])
    for (const propertyName of propertyNames) {
      expect(
        schema.safeParse({ properties: { [propertyName]: { value: 6.4 } } })
          .success,
      ).toBe(false)
    }
  }
})
