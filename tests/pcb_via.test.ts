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
    source_net_id: "source_net_1",
  })

  expect(via.subcircuit_connectivity_map_key).toBe("foo")
  expect(via.source_trace_id).toBe("source_trace_1")
  expect(via.source_net_id).toBe("source_net_1")
})

test("any_circuit_element includes pcb_via connectivity references", () => {
  const via = any_circuit_element.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "bar",
    source_trace_id: "source_trace_2",
    source_net_id: "source_net_2",
  }) as PcbVia

  expect(via.subcircuit_connectivity_map_key).toBe("bar")
  expect(via.source_trace_id).toBe("source_trace_2")
  expect(via.source_net_id).toBe("source_net_2")
})

test("pcb_via rejects an empty source net id", () => {
  expect(() =>
    pcb_via.parse({
      type: "pcb_via",
      x: 1,
      y: 2,
      layers: ["top", "bottom"],
      source_net_id: "",
    }),
  ).toThrow()
})

test("pcb_via accepts span-only input and preserves endpoint direction", () => {
  const input = {
    type: "pcb_via",
    x: "1mm",
    y: "2mm",
    from_layer: { name: "inner2" },
    to_layer: "top",
    is_tented: true,
  }
  for (const schema of [pcb_via, any_circuit_element]) {
    const via = schema.parse(input) as PcbVia
    expect(via.from_layer).toBe("inner2")
    expect(via.to_layer).toBe("top")
    expect(via.x).toBe(1)
    expect(via.outer_diameter).toBe(0.6)
    expect(via.is_tented).toBe(true)
    expect(via).not.toHaveProperty("layers")
    expect(pcb_via.parse(via)).toEqual(via)
  }
})

test("pcb_via normalizes unordered legacy layer references to physical extremes", () => {
  for (const schema of [pcb_via, any_circuit_element]) {
    const via = schema.parse({
      type: "pcb_via",
      x: 0,
      y: 0,
      layers: [{ name: "inner8" }, "inner2", "inner4", "inner2"],
    }) as PcbVia
    expect(via.from_layer).toBe("inner2")
    expect(via.to_layer).toBe("inner8")
    expect(via).not.toHaveProperty("layers")
  }
})

test("pcb_via rejects missing spans and malformed legacy layers", () => {
  for (const span of [
    {},
    { from_layer: "top" },
    { to_layer: "bottom" },
    { layers: [] },
    { layers: ["top"] },
    { layers: ["top", "top"] },
    { layers: ["top", "inner9"] },
    { from_layer: "top", to_layer: "bottom", layers: [] },
    { from_layer: "top", to_layer: "bottom", layers: "top,bottom" },
    { from_layer: "top", to_layer: "bottom", layers: null },
  ]) {
    for (const schema of [pcb_via, any_circuit_element]) {
      expect(
        schema.safeParse({ type: "pcb_via", x: 0, y: 0, ...span }).success,
      ).toBe(false)
    }
  }
})
