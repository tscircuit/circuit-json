import { test, expect } from "bun:test"
import { source_manually_placed_via } from "../src/source/source_manually_placed_via"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_manually_placed_via parses an assigned source net", () => {
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

test("source_manually_placed_via omits an unassigned source net", () => {
  const via = source_manually_placed_via.parse({
    type: "source_manually_placed_via",
    source_manually_placed_via_id: "via1",
    source_group_id: "group1",
  })

  expect(via.source_net_id).toBeUndefined()
})

test("source_manually_placed_via rejects an empty source net id", () => {
  const result = source_manually_placed_via.safeParse({
    type: "source_manually_placed_via",
    source_manually_placed_via_id: "via1",
    source_group_id: "group1",
    source_net_id: "",
  })

  expect(result.success).toBe(false)
})

test("any_circuit_element includes a manually placed via without a source net", () => {
  const parsed = any_circuit_element.parse({
    type: "source_manually_placed_via",
    source_manually_placed_via_id: "via1",
    source_group_id: "group1",
    x: "0mm",
    y: "0mm",
    layers: ["top", "bottom"],
  })
  expect(parsed.type).toBe("source_manually_placed_via")
})
