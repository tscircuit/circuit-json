import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_assembly_bom_item,
  type CadAssemblyBomItem,
} from "../src"

const screws: CadAssemblyBomItem = {
  type: "cad_assembly_bom_item",
  cad_assembly_bom_item_id: "bom_screws",
  name: "M3 screws",
  quantity: 4,
}

test("assembly materials need no source component, PCB footprint or CAD geometry", () => {
  const item = {
    ...screws,
    purchase_url: "https://www.amazon.com/dp/B000000001?variant=black",
  }
  expect(any_circuit_element.parse(item)).toEqual(item)
})

test("nested BOM entries preserve ownership, explicit quantities and geometry references", () => {
  const parent: CadAssemblyBomItem = {
    type: "cad_assembly_bom_item",
    cad_assembly_bom_item_id: "bom_housing",
    name: "Housing assembly",
    quantity: 2,
    source_component_id: "housing",
  }
  const child: CadAssemblyBomItem = {
    ...screws,
    parent_cad_assembly_bom_item_id: parent.cad_assembly_bom_item_id,
    cad_component_ids: ["screw_geometry_1", "screw_geometry_2"],
    supplier_part_numbers: { jlcpcb: ["C1525"] },
    purchase_url: "https://parts.example.com/screws/m3",
  }
  expect(
    [parent, child].map((item) => any_circuit_element.parse(item)),
  ).toEqual([parent, child])
  expect(cad_assembly_bom_item.parse(child).quantity).toBe(4)
})

test("existing source components retain their exact parsed shape", () => {
  const source = {
    type: "source_component" as const,
    ftype: "subassembly" as const,
    source_component_id: "module",
    name: "Module",
    supplier_part_numbers: { jlcpcb: ["C1525"] },
  }
  expect(any_circuit_element.parse(source)).toEqual(source)
})

test("BOM quantities are explicit positive safe integers", () => {
  const { quantity, ...withoutQuantity } = screws
  expect(cad_assembly_bom_item.safeParse(withoutQuantity).success).toBe(false)
  for (const quantity of [
    0,
    -1,
    1.5,
    Infinity,
    NaN,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    expect(
      cad_assembly_bom_item.safeParse({ ...screws, quantity }).success,
    ).toBe(false)
  }
})

test("BOM identity and names cannot be empty", () => {
  expect(
    cad_assembly_bom_item.safeParse({ ...screws, name: " " }).success,
  ).toBe(false)
  expect(
    cad_assembly_bom_item.safeParse({ ...screws, cad_assembly_bom_item_id: "" })
      .success,
  ).toBe(false)
  expect(
    cad_assembly_bom_item.safeParse({
      ...screws,
      parent_cad_assembly_bom_item_id: "",
    }).success,
  ).toBe(false)
})

test("purchase links accept HTTP(S) listings from arbitrary stores", () => {
  for (const purchase_url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///tmp/part",
    "/parts/123",
    "not a url",
    "",
  ]) {
    expect(
      cad_assembly_bom_item.safeParse({ ...screws, purchase_url }).success,
    ).toBe(false)
  }
  expect(
    cad_assembly_bom_item.parse({
      ...screws,
      purchase_url: "http://parts.example.com/123",
    }).purchase_url,
  ).toBe("http://parts.example.com/123")
})
