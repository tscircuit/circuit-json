import { expect, test } from "bun:test"
import { pcb_via, type PcbVia } from "../src/pcb/pcb_via"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_via allows subcircuit_connectivity_map_key", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "foo",
  })

  expect(via.subcircuit_connectivity_map_key).toBe("foo")
})

test("any_circuit_element includes pcb_via with subcircuit_connectivity_map_key", () => {
  const via = any_circuit_element.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "bar",
  }) as PcbVia

  expect(via.subcircuit_connectivity_map_key).toBe("bar")
})
