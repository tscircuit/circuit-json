import { test, expect } from "bun:test"
import { pcb_copper_pour } from "../src/pcb/pcb_copper_pour"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_copper_pour rect parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    layer: "top",
    source_net_id: "net1",
  })
  expect(pour.shape).toBe("rect")
  if (pour.shape === "rect") {
    expect(pour.width).toBe(10)
  }
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})

test("pcb_copper_pour brep parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "brep",
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0, bulge: 1 },
          { x: 1, y: 1 },
        ],
      },
    },
    layer: "top",
    source_net_id: "net1",
  })
  expect(pour.shape).toBe("brep")
  if (pour.shape === "brep") {
    expect(pour.brep_shape.outer_ring.vertices.length).toBe(2)
    expect(pour.brep_shape.inner_rings).toEqual([])
  }
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})

test("pcb_copper_pour polygon parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ],
    layer: "top",
  })
  expect(pour.shape).toBe("polygon")
  if (pour.shape === "polygon") {
    expect(pour.points.length).toBe(3)
  }
  expect(pour.source_net_id).toBeUndefined()
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})

test("coveredWithSolderMask defaults to true", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    layer: "top",
    source_net_id: "net1",
  })
  expect(pour.covered_with_solder_mask).toBe(true)
})

test.each([
  {
    shape: "rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
  },
  {
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ],
  },
  {
    shape: "brep",
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 5, y: 10 },
        ],
      },
    },
  },
])(
  "copper pour rule metadata survives Circuit JSON parsing: $shape",
  (shape) => {
    const pour = pcb_copper_pour.parse({
      type: "pcb_copper_pour",
      layer: "top",
      ...shape,
      clearance: "0.3mm",
      pad_margin: "0.4mm",
      trace_margin: "0.5mm",
      board_edge_margin: "0.6mm",
      cutout_margin: "0.7mm",
      use_thermal_reliefs: true,
      thermal_relief_spoke_width: "0.25mm",
    })

    // Exporters consume the general Circuit JSON schema, not just the pour schema.
    const roundTripped = any_circuit_element.parse(
      JSON.parse(JSON.stringify(pour)),
    )
    expect(roundTripped).toMatchObject({
      clearance: 0.3,
      pad_margin: 0.4,
      trace_margin: 0.5,
      board_edge_margin: 0.6,
      cutout_margin: 0.7,
      use_thermal_reliefs: true,
      thermal_relief_spoke_width: 0.25,
    })
  },
)

test("copper pour rules distinguish omitted metadata from zero and false", () => {
  const legacy = {
    type: "pcb_copper_pour",
    shape: "rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    layer: "top",
  }
  const pour = pcb_copper_pour.parse(legacy)
  for (const field of [
    "clearance",
    "pad_margin",
    "trace_margin",
    "board_edge_margin",
    "cutout_margin",
    "use_thermal_reliefs",
    "thermal_relief_spoke_width",
  ]) {
    expect(pour).not.toHaveProperty(field)
  }

  const explicit = any_circuit_element.parse({
    ...legacy,
    clearance: 0,
    pad_margin: 0,
    trace_margin: 0,
    board_edge_margin: 0,
    cutout_margin: 0,
    use_thermal_reliefs: false,
    thermal_relief_spoke_width: 0,
  })
  expect(explicit).toMatchObject({
    clearance: 0,
    pad_margin: 0,
    trace_margin: 0,
    board_edge_margin: 0,
    cutout_margin: 0,
    use_thermal_reliefs: false,
    thermal_relief_spoke_width: 0,
  })
})
