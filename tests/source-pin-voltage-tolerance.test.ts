import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_pin_attributes,
  source_port,
  type SourcePort,
} from "../src"

test("source pins preserve optional relative voltage tolerances through JSON parsing", () => {
  for (const tolerance of [0, 0.05, 1]) {
    const input: SourcePort = {
      type: "source_port",
      source_port_id: "source_port_vcc",
      name: "VCC",
      requires_voltage: 3.3,
      required_voltage_tolerance: tolerance,
    }
    expect(source_port.parse(input)).toEqual(input)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(input))),
    ).toEqual(input)
    expect(source_pin_attributes.parse(input).required_voltage_tolerance).toBe(
      tolerance,
    )
  }
  expect(source_pin_attributes.parse({ requires_voltage: 3.3 })).toEqual({
    requires_voltage: 3.3,
  })
})

test("source pin voltage tolerances require finite fractions between zero and one", () => {
  for (const tolerance of [
    -0.05,
    1.01,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "5%",
    "0.05",
    null,
    true,
  ]) {
    expect(
      source_port.safeParse({
        type: "source_port",
        source_port_id: "source_port_vcc",
        name: "VCC",
        required_voltage_tolerance: tolerance,
      }).success,
    ).toBe(false)
  }
})
