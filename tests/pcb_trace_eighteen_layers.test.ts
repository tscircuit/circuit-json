import { expect, test } from "bun:test"
import { pcbRenderLayer } from "../src/common/PcbRenderLayer"
import { pcb_trace } from "../src/pcb/pcb_trace"
import { pcb_via } from "../src/pcb/pcb_via"

test("preserves the inner copper of an 18-layer board", () => {
  const route = [
    { route_type: "wire", x: 0, y: 0, width: 0.1, layer: "inner9" },
    {
      route_type: "via",
      x: 1,
      y: 0,
      from_layer: "inner9",
      to_layer: "inner16",
    },
    { route_type: "wire", x: 1, y: 1, width: 0.1, layer: "inner16" },
  ]
  expect(pcb_trace.parse({ type: "pcb_trace", route }).route).toMatchObject(
    route,
  )
  const layers = [
    "top",
    ...Array.from({ length: 16 }, (_, i) => `inner${i + 1}`),
    "bottom",
  ]
  expect(
    pcb_via.parse({
      type: "pcb_via",
      x: 1,
      y: 0,
      outer_diameter: 0.3,
      hole_diameter: 0.15,
      layers,
    }).layers,
  ).toEqual(layers)
  for (const layer of layers) {
    expect(pcbRenderLayer.parse(`${layer}_copper`)).toBe(`${layer}_copper`)
  }
})
