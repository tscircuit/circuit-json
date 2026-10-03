import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_pin_attributes,
  source_port,
  type SourcePinAttributes,
  type SourcePortInput,
} from "../src"
import { expectTypesMatch } from "../src/utils/expect-types-match"

test("source pin voltages accept units at input and emit finite numbers in Circuit JSON", () => {
  for (const [value, expectedVolts] of [
    [2.8, 2.8],
    ["2.8V", 2.8],
    ["2800mV", 2.8],
    [" 2.8 V ", 2.8],
    ["2.8", 2.8],
    ["2800m", 2.8],
    ["2.8e-3V", 0.0028],
    ["10µV", 0.00001],
    [0, 0],
    ["0V", 0],
    ["-5V", -5],
  ] as const) {
    const attributes = { requires_voltage: value, provides_voltage: value }
    const parsedAttributes = source_pin_attributes.parse(attributes)
    expect(parsedAttributes.requires_voltage).toBeCloseTo(expectedVolts, 12)
    expect(parsedAttributes.provides_voltage).toBeCloseTo(expectedVolts, 12)
    const input: SourcePortInput = {
      type: "source_port",
      source_port_id: "source_port_avcc",
      name: "AVCC",
      ...attributes,
    }
    const parsed = source_port.parse(input)
    expectTypesMatch<typeof parsed.requires_voltage, number | undefined>(true)
    expectTypesMatch<
      SourcePinAttributes["provides_voltage"],
      number | undefined
    >(true)
    const json = JSON.parse(JSON.stringify(any_circuit_element.parse(input)))
    expect(typeof json.requires_voltage).toBe("number")
    expect(typeof json.provides_voltage).toBe("number")
    expect(json.requires_voltage).toBeCloseTo(expectedVolts, 12)
    expect(json.provides_voltage).toBeCloseTo(expectedVolts, 12)
    expect(input.requires_voltage).toBe(value)
  }
  expect(source_pin_attributes.parse({})).toEqual({})
})
