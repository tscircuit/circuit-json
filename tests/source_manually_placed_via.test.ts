import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_manually_placed_via } from "../src/source/source_manually_placed_via"

test("source_manually_placed_via parses", () => {
  const via = source_manually_placed_via.parse({
    type: "source_manually_placed_via",
    source_manually_placed_via_id: "via1",
    source_group_id: "group1",
    source_net_id: "net1",
    x: "0mm",
    y: "0mm",
    layers: ["top", "bottom"],
  })
  expect(via.source_net_id).toBe("net1")
})

test("any_circuit_element includes source_manually_placed_via", () => {
  const parsed = any_circuit_element.parse({
    type: "source_manually_placed_via",
    source_manually_placed_via_id: "via1",
    source_group_id: "group1",
    source_net_id: "net1",
    x: "0mm",
    y: "0mm",
    layers: ["top", "bottom"],
  })
  expect(parsed.type).toBe("source_manually_placed_via")
})
