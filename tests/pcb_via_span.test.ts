import { expect, test } from "bun:test"
import {
  any_circuit_element,
  getPcbViaSpanFromLayers,
  getPcbViaSpanLayers,
  type LayerRef,
  type PcbVia,
} from "../src"

test("physical span does not use the legacy logical transition or change JSON", () => {
  const input: PcbVia = {
    type: "pcb_via",
    pcb_via_id: "pcb_via_1",
    x: 1,
    y: 2,
    outer_diameter: 0.45,
    hole_diameter: 0.2,
    from_layer: "top",
    to_layer: "inner2",
    layers: ["top", "inner1", "inner2", "bottom"],
    source_net_id: "net_1",
    pcb_trace_id: "pcb_trace_1",
    source_trace_id: "source_trace_1",
    subcircuit_connectivity_map_key: "connected_net_1",
  }
  const before = JSON.stringify(input)
  const via = any_circuit_element.parse(input) as PcbVia
  const span = getPcbViaSpanFromLayers(via.layers, 4)
  expect(span).toEqual({ from_layer: "top", to_layer: "bottom" })
  expect(getPcbViaSpanLayers(span, 4)).toEqual(input.layers)
  expect(via).toEqual(input)
  expect(JSON.stringify(input)).toBe(before)
})

test.each([2, 4, 6, 8, 10])(
  "expands a through span on a %i-layer board",
  (count) => {
    const layers = getPcbViaSpanLayers(
      { from_layer: "top", to_layer: "bottom" },
      count,
    )
    expect(layers).toEqual([
      "top",
      ...Array.from(
        { length: count - 2 },
        (_, index) => `inner${index + 1}` as LayerRef,
      ),
      "bottom",
    ])
    expect(getPcbViaSpanFromLayers(layers, count)).toEqual({
      from_layer: "top",
      to_layer: "bottom",
    })
  },
)

test("blind, buried and reversed spans include only their physical depth", () => {
  expect(
    getPcbViaSpanLayers({ from_layer: "inner2", to_layer: "top" }, 4),
  ).toEqual(["top", "inner1", "inner2"])
  expect(
    getPcbViaSpanLayers({ from_layer: "inner3", to_layer: "inner1" }, 6),
  ).toEqual(["inner1", "inner2", "inner3"])
})

test("legacy endpoint-only, unordered and duplicate layers normalize without mutation", () => {
  const layers = Object.freeze(["bottom", "top", "bottom"] as const)
  expect(getPcbViaSpanFromLayers(layers, 4)).toEqual({
    from_layer: "top",
    to_layer: "bottom",
  })
  expect(getPcbViaSpanLayers(getPcbViaSpanFromLayers(layers, 4), 4)).toEqual([
    "top",
    "inner1",
    "inner2",
    "bottom",
  ])
  expect(layers).toEqual(["bottom", "top", "bottom"])
})

test("invalid spans and board contexts fail instead of silently shrinking copper", () => {
  for (const count of [0, 1, 11, 4.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    expect(() => getPcbViaSpanFromLayers(["top", "bottom"], count)).toThrow()
    expect(() =>
      getPcbViaSpanLayers({ from_layer: "top", to_layer: "bottom" }, count),
    ).toThrow()
  }
  const invalidLayers: LayerRef[][] = [
    [],
    ["top"],
    ["top", "top"],
    ["top", "inner3"],
  ]
  for (const layers of invalidLayers) {
    expect(() => getPcbViaSpanFromLayers(layers, 4)).toThrow()
  }
  expect(() =>
    getPcbViaSpanLayers({ from_layer: "top", to_layer: "inner1" }, 2),
  ).toThrow()
  expect(() =>
    getPcbViaSpanLayers({ from_layer: "top", to_layer: "top" }, 4),
  ).toThrow()
})
