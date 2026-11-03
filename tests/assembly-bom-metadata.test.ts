import { expect, test } from "bun:test"
import { any_circuit_element, type SourceSubassembly } from "../src"

const component: SourceSubassembly = {
  type: "source_component",
  ftype: "subassembly",
  source_component_id: "housing",
  name: "Housing",
}

test("assembly quantities and product links survive the public Circuit JSON parser", () => {
  const input: SourceSubassembly = {
    ...component,
    parent_source_component_id: "device",
    bom_quantity: 2,
    supplier_part_urls: [
      "https://www.amazon.com/dp/B000000001?variant=black&quantity=2",
      "https://parts.example.com/enclosures/case-1",
    ],
  }
  expect(any_circuit_element.parse(input)).toEqual(input)
})

test("product links coexist with existing electronic supplier part numbers", () => {
  const input = {
    type: "source_component" as const,
    ftype: "simple_resistor" as const,
    source_component_id: "resistor",
    name: "R1",
    resistance: 1000,
    supplier_part_numbers: { jlcpcb: ["C1525"] },
    supplier_part_urls: ["https://parts.example.com/resistors/1k"],
  }
  expect(any_circuit_element.parse(input)).toEqual(input)
})

test("old components retain their exact shape without acquiring BOM defaults", () => {
  const input: SourceSubassembly = {
    ...component,
    supplier_part_numbers: { jlcpcb: ["C1525"] },
  }
  expect(any_circuit_element.parse(input)).toEqual(input)
  expect(
    any_circuit_element.parse({ ...component, supplier_part_urls: [] }),
  ).toEqual({ ...component, supplier_part_urls: [] })
})

test("supplier links must be complete HTTP or HTTPS URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///tmp/part",
    "ftp://parts.example.com/part",
    "/parts/123",
    "not a url",
    "",
  ]) {
    expect(
      any_circuit_element.safeParse({ ...component, supplier_part_urls: [url] })
        .success,
    ).toBe(false)
  }
  expect(
    any_circuit_element.safeParse({
      ...component,
      supplier_part_urls: ["http://parts.example.com/part"],
    }).success,
  ).toBe(true)
})

test("per-assembly quantities must be finite positive integers", () => {
  for (const quantity of [0, -1, 1.5, Infinity, NaN]) {
    expect(
      any_circuit_element.safeParse({ ...component, bom_quantity: quantity })
        .success,
    ).toBe(false)
  }
})
