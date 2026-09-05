import { test, expect } from "bun:test"
import { any_circuit_element, source_confusing_net_name_warning } from "../src"

const input = {
  type: "source_confusing_net_name_warning",
  message: "Disconnected nets share the name GND",
  net_name: "GND",
  source_net_ids: ["net_a", "net_b"],
}

test("confusing net name warnings parse through the circuit union", () => {
  const warning = source_confusing_net_name_warning.parse(input)
  expect(warning.warning_type).toBe(input.type)
  expect(warning.source_confusing_net_name_warning_id).toStartWith(input.type)
  expect(any_circuit_element.parse(warning)).toEqual(warning)
})

test("requires at least two affected nets", () => {
  expect(
    source_confusing_net_name_warning.safeParse({
      ...input,
      source_net_ids: ["net_a"],
    }).success,
  ).toBe(false)
})
