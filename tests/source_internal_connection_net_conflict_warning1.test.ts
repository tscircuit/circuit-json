import { test, expect } from "bun:test"
import {
  any_circuit_element,
  source_internal_connection_net_conflict_warning,
} from "../src"

test("internal connection net conflict warnings parse through the circuit union", () => {
  const warning = source_internal_connection_net_conflict_warning.parse({
    type: "source_internal_connection_net_conflict_warning",
    message: "Pins pin1 (EN) and pin2 (GND) on SW1 are internally connected",
    source_component_id: "source_component_0",
    source_port_ids: ["source_port_0", "source_port_1"],
    source_net_ids: ["source_net_0", "source_net_1"],
  })
  expect(warning.warning_type).toBe(
    "source_internal_connection_net_conflict_warning",
  )
  expect(
    warning.source_internal_connection_net_conflict_warning_id,
  ).toStartWith("source_internal_connection_net_conflict_warning")
  expect(any_circuit_element.parse(warning)).toEqual(warning)
})
