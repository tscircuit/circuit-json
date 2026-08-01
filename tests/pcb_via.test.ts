import { expect, test } from "bun:test"
import { pcb_via, type PcbVia } from "../src/pcb/pcb_via"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_via allows source and subcircuit connectivity references", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "foo",
    source_trace_id: "source_trace_1",
  })

  expect(via.subcircuit_connectivity_map_key).toBe("foo")
  expect(via.source_trace_id).toBe("source_trace_1")
})

test("any_circuit_element includes pcb_via connectivity references", () => {
  const via = any_circuit_element.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "bar",
    source_trace_id: "source_trace_2",
  }) as PcbVia

  expect(via.subcircuit_connectivity_map_key).toBe("bar")
  expect(via.source_trace_id).toBe("source_trace_2")
})
