import { expect, test } from "bun:test"
import { any_circuit_element, bom_source, type SourceSubassembly } from "../src"

test("assembly BOM metadata survives the public Circuit JSON parser", () => {
  const component: SourceSubassembly = {
    type: "source_component",
    ftype: "subassembly",
    source_component_id: "housing",
    name: "Housing",
    parent_source_component_id: "device",
    bom_quantity: 2,
    bom_assembly_mode: "buy",
    bom_sources: [
      {
        supplier_name: "amazon",
        url: "https://www.amazon.com/dp/example",
        pack_quantity: 10,
      },
      { supplier_name: "custom-supplier", supplier_part_number: "CASE-1" },
    ],
  }
  expect(any_circuit_element.parse(component)).toEqual(component)
})

test("old components do not acquire BOM defaults or lose supplier numbers", () => {
  const component: SourceSubassembly = {
    type: "source_component",
    ftype: "subassembly",
    source_component_id: "module",
    name: "Module",
    supplier_part_numbers: { jlcpcb: ["C1525"] },
  }
  expect(any_circuit_element.parse(component)).toEqual(component)
})

test("invalid quantities and unsafe or empty purchasing sources are rejected", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///tmp/part",
    "not a url",
  ]) {
    expect(bom_source.safeParse({ supplier_name: "store", url }).success).toBe(
      false,
    )
  }
  expect(bom_source.safeParse({ supplier_name: "store" }).success).toBe(false)
  expect(
    bom_source.safeParse({ supplier_name: " ", supplier_part_number: "123" })
      .success,
  ).toBe(false)
  for (const quantity of [0, -1, 1.5, Infinity, NaN]) {
    expect(
      bom_source.safeParse({
        supplier_name: "store",
        supplier_part_number: "123",
        pack_quantity: quantity,
      }).success,
    ).toBe(false)
    expect(
      any_circuit_element.safeParse({
        type: "source_component",
        ftype: "subassembly",
        source_component_id: "p",
        name: "P",
        bom_quantity: quantity,
      }).success,
    ).toBe(false)
  }
})
