import { expect, test } from "bun:test"
import {
  pcb_plated_hole,
  type PcbPlatedHoleInput,
} from "../src/pcb/pcb_plated_hole"
import type { PcbPadStack } from "../src/pcb/properties/pcb_pad_stack"
import type { LayerRef } from "../src/pcb/properties/layer_ref"
import { pcb_via } from "../src/pcb/pcb_via"

const pmp22650InnerLayers: LayerRef[] = [
  "inner1",
  "inner2",
  "inner3",
  "inner4",
  "inner5",
  "inner6",
]

const pmp22650Mp1Pad4 = {
  type: "pcb_plated_hole" as const,
  pcb_plated_hole_id: "pcb_plated_hole_altium_6144",
  shape: "circular_hole_with_rect_pad" as const,
  hole_shape: "circle" as const,
  pad_shape: "rect" as const,
  hole_diameter: 2.5,
  rect_pad_width: 5,
  rect_pad_height: 5,
  rect_border_radius: 0.05,
  rect_ccw_rotation: 0,
  hole_offset_x: 0,
  hole_offset_y: 0,
  x: 20.7332,
  y: 42.370398,
  layers: ["top", ...pmp22650InnerLayers, "bottom"],
  pad_stack: [
    {
      layer: "top",
      shape: "rect" as const,
      width: 5,
      height: 5,
      corner_radius: 0.05,
    },
    ...pmp22650InnerLayers.map((layer) => ({
      layer,
      shape: "circle" as const,
      radius: 2.159,
    })),
    {
      layer: "bottom",
      shape: "rect" as const,
      width: 5,
      height: 5,
      corner_radius: 0.05,
    },
  ],
  pcb_port_id: "pcb_port_altium_6144",
  port_hints: ["4"],
  pcb_component_id: "pcb_component_altium_74",
} satisfies PcbPlatedHoleInput

const padStack: PcbPadStack = [
  { layer: "top", shape: "circle", radius: 2.5 },
  {
    layer: "inner1",
    shape: "rect",
    width: 4.318,
    height: 4.318,
    ccw_rotation: 45,
  },
  {
    layer: "bottom",
    shape: "pill",
    width: 5,
    height: 3,
    radius: 1.5,
  },
]

test("pcb_plated_hole preserves the real PMP22650 MP1 pad stack", () => {
  const platedHole = pcb_plated_hole.parse(pmp22650Mp1Pad4)

  expect(platedHole).toEqual(pmp22650Mp1Pad4)
  expect(platedHole.pad_stack?.[0]).toEqual({
    layer: "top",
    shape: "rect",
    width: 5,
    height: 5,
    corner_radius: 0.05,
  })
  expect(platedHole.pad_stack?.[1]).toEqual({
    layer: "inner1",
    shape: "circle",
    radius: 2.159,
  })
})

test("pcb_via preserves layer-specific pad geometry", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    pcb_via_id: "pcb_via_1",
    x: 10,
    y: 20,
    outer_diameter: 5,
    hole_diameter: 2,
    layers: ["top", "inner1", "bottom"],
    pad_stack: padStack,
  })

  expect(via.pad_stack).toEqual(padStack)
})

test("pad-stack entries require shape-specific dimensions", () => {
  expect(() =>
    pcb_via.parse({
      type: "pcb_via",
      pcb_via_id: "pcb_via_1",
      x: 10,
      y: 20,
      layers: ["top", "bottom"],
      pad_stack: [{ layer: "top", shape: "circle" }],
    }),
  ).toThrow()
})
