import { test, expect } from "bun:test"
import { source_simple_connector } from "../src/source/source_simple_connector"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_simple_connector parses without standard", () => {
  const connector = source_simple_connector.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector1",
    name: "J1",
  })
  expect(connector.ftype).toBe("simple_connector")
  expect(connector.standard).toBeUndefined()
})

test("source_simple_connector parses with usb_c standard", () => {
  const connector = source_simple_connector.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector2",
    name: "J2",
    standard: "usb_c",
  })
  expect(connector.ftype).toBe("simple_connector")
  expect(connector.standard).toBe("usb_c")
})

test("source_simple_connector parses with m2 standard", () => {
  const connector = source_simple_connector.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector3",
    name: "J3",
    standard: "m2",
  })
  expect(connector.standard).toBe("m2")
})

test("source_simple_connector parses insertion_direction options", () => {
  const insertionDirections = ["from_above", "from_side"] as const

  for (const insertion_direction of insertionDirections) {
    const connector = source_simple_connector.parse({
      type: "source_component",
      ftype: "simple_connector",
      source_component_id: `connector-${insertion_direction}`,
      name: "J4",
      insertion_direction,
    })
    expect(connector.insertion_direction).toBe(insertion_direction)
  }
})

test("source_simple_connector rejects invalid standard", () => {
  expect(() =>
    source_simple_connector.parse({
      type: "source_component",
      ftype: "simple_connector",
      source_component_id: "connector4",
      name: "J4",
      standard: "invalid",
    }),
  ).toThrow()
})

test("source_simple_connector rejects invalid insertion_direction", () => {
  expect(() =>
    source_simple_connector.parse({
      type: "source_component",
      ftype: "simple_connector",
      source_component_id: "connector6",
      name: "J6",
      insertion_direction: "sideways",
    }),
  ).toThrow()
})

test("any_circuit_element includes source_simple_connector", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector5",
    name: "J5",
    standard: "usb_c",
    insertion_direction: "from_above",
  })
  if ("ftype" in parsed && parsed.ftype === "simple_connector") {
    expect(parsed.ftype).toBe("simple_connector")
    expect(parsed.insertion_direction).toBe("from_above")
  } else {
    throw new Error("Parsed element not a source_simple_connector")
  }
})
