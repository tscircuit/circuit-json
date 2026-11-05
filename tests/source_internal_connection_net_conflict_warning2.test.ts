import { test, expect } from "bun:test"
import { source_internal_connection_net_conflict_warning } from "../src"

test("requires at least two conflicting nets", () => {
  expect(
    source_internal_connection_net_conflict_warning.safeParse({
      type: "source_internal_connection_net_conflict_warning",
      message: "Pins pin1 (EN) and pin2 (GND) on SW1 are internally connected",
      source_component_id: "source_component_0",
      source_port_ids: ["source_port_0", "source_port_1"],
      source_net_ids: ["source_net_0"],
    }).success,
  ).toBe(false)
})
