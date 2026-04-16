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

test("any_circuit_element includes source_simple_connector", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector5",
    name: "J5",
    standard: "usb_c",
  })
  if ("ftype" in parsed && parsed.ftype === "simple_connector") {
    expect(parsed.ftype).toBe("simple_connector")
  } else {
    throw new Error("Parsed element not a source_simple_connector")
  }
})
