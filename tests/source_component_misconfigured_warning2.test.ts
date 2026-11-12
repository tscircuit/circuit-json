import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"

test("any_circuit_element includes source_component_misconfigured_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component_misconfigured_warning",
    message: "Pins pin1 (EN) and pin2 (GND) on SW1 are internally connected",
    source_component_ids: ["source_component_0"],
  })

  expect(parsed.type).toBe("source_component_misconfigured_warning")
})
