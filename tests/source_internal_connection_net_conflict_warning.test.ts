import { test, expect } from "bun:test"
import {
  any_circuit_element,
  source_internal_connection_net_conflict_warning,
} from "../src"

const input = {
  type: "source_internal_connection_net_conflict_warning" as const,
  message: "Pins pin1 (EN) and pin2 (GND) on SW1 are internally connected",
  source_component_id: "source_component_0",
  source_port_ids: ["source_port_0", "source_port_1"],
  source_net_ids: ["source_net_0", "source_net_1"],
}

test("internal connection net conflict warnings parse through the circuit union", () => {
  const warning = source_internal_connection_net_conflict_warning.parse(input)
  expect(warning.warning_type).toBe(input.type)
  expect(
    warning.source_internal_connection_net_conflict_warning_id,
  ).toStartWith(input.type)
  expect(any_circuit_element.parse(warning)).toEqual(warning)
})

test("requires at least two conflicting nets", () => {
  expect(
    source_internal_connection_net_conflict_warning.safeParse({
      ...input,
      source_net_ids: ["source_net_0"],
    }).success,
  ).toBe(false)
})
