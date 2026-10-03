import { expect, test } from "bun:test"
import { source_pin_attributes, source_port } from "../src"

test("source pin voltage scalars reject ranges, conditional prose and non-finite values", () => {
  for (const value of [
    "",
    "unknown",
    "2.5-3.1V",
    "2.8 V when enabled",
    "2.8V + 1.8V",
    "2.8A",
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]) {
    for (const attribute of ["requires_voltage", "provides_voltage"]) {
      expect(
        source_pin_attributes.safeParse({ [attribute]: value }).success,
      ).toBe(false)
      expect(
        source_port.safeParse({
          type: "source_port",
          source_port_id: "source_port_avcc",
          name: "AVCC",
          [attribute]: value,
        }).success,
      ).toBe(false)
    }
  }
})
