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

test("source_simple_connector parses JST standards with pin_count", () => {
  const jstStandards = [
    "jst_sh",
    "jst_gh",
    "jst_zh",
    "jst_ph",
    "jst_xh",
    "jst_vh",
  ] as const

  for (const standard of jstStandards) {
    const connector = source_simple_connector.parse({
      type: "source_component",
      ftype: "simple_connector",
      source_component_id: `connector_${standard}`,
      name: "J1",
      standard,
      pin_count: 4,
    })

    expect(connector.standard).toBe(standard)
    expect(connector.pin_count).toBe(4)
  }
})

test("source_simple_connector rejects invalid pin_count", () => {
  for (const pin_count of [0, -1, 1.5]) {
    expect(() =>
      source_simple_connector.parse({
        type: "source_component",
        ftype: "simple_connector",
        source_component_id: "connector_invalid_pin_count",
        name: "J1",
        standard: "jst_ph",
        pin_count,
      }),
    ).toThrow()
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

test("any_circuit_element includes source_simple_connector", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_connector",
    source_component_id: "connector5",
    name: "J5",
    standard: "jst_ph",
    pin_count: 2,
  })
  if ("ftype" in parsed && parsed.ftype === "simple_connector") {
    expect(parsed.ftype).toBe("simple_connector")
    expect(parsed.standard).toBe("jst_ph")
    expect(parsed.pin_count).toBe(2)
  } else {
    throw new Error("Parsed element not a source_simple_connector")
  }
})
