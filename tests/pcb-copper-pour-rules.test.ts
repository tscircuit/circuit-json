import { expect, test } from "bun:test"
import { pcb_copper_pour } from "../src/pcb/pcb_copper_pour"

test("pcb_copper_pour parses clearance, margin, thermal relief, and outline rule props", () => {
  const parsed = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    pcb_copper_pour_id: "pcb_copper_pour_1",
    shape: "brep",
    layer: "inner2",
    source_net_id: "source_net_1",
    covered_with_solder_mask: true,
    clearance: "0.3mm",
    pad_margin: "0.35mm",
    trace_margin: "0.25mm",
    board_edge_margin: "0.4mm",
    cutout_margin: "0.45mm",
    use_thermal_reliefs: true,
    thermal_relief_spoke_width: "0.3mm",
    outline: [
      { x: -10, y: -10 },
      { x: 10, y: -10 },
      { x: 10, y: 10 },
      { x: -10, y: 10 },
    ],
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: -9.6, y: -9.6 },
          { x: -9.6, y: 9.6 },
          { x: 9.6, y: 9.6 },
          { x: 9.6, y: -9.6 },
        ],
      },
      inner_rings: [],
    },
  })

  expect(parsed.clearance).toBe(0.3)
  expect(parsed.pad_margin).toBe(0.35)
  expect(parsed.trace_margin).toBe(0.25)
  expect(parsed.board_edge_margin).toBe(0.4)
  expect(parsed.cutout_margin).toBe(0.45)
  expect(parsed.use_thermal_reliefs).toBe(true)
  expect(parsed.thermal_relief_spoke_width).toBe(0.3)
  expect(parsed.outline).toHaveLength(4)
})
