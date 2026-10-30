import { expect, test } from "bun:test"
import { any_circuit_element, type PCBKeepoutInput } from "src"

const keepout = {
  type: "pcb_keepout",
  shape: "brep",
  pcb_keepout_id: "annular_keepout",
  pcb_component_id: "component_1",
  pcb_group_id: "group_1",
  subcircuit_id: "subcircuit_1",
  layers: ["top", "inner1", "bottom"],
  description: "Circular keepout with an open center",
  excluded_pcb_component_ids: ["component_2"],
  brep_shape: {
    outer_ring: {
      vertices: [
        { x: "3mm", y: 0, bulge: -1 },
        { x: "-3mm", y: 0, bulge: -1 },
      ],
    },
    inner_rings: [
      {
        vertices: [
          { x: "2mm", y: 0, bulge: 1 },
          { x: "-2mm", y: 0, bulge: 1 },
        ],
      },
    ],
  },
} satisfies PCBKeepoutInput

test("BREP keepouts preserve arcs, holes, layers, and ownership metadata", () => {
  const parsed = any_circuit_element.parse(keepout)
  expect(parsed).toEqual({
    ...keepout,
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 3, y: 0, bulge: -1 },
          { x: -3, y: 0, bulge: -1 },
        ],
      },
      inner_rings: [
        {
          vertices: [
            { x: 2, y: 0, bulge: 1 },
            { x: -2, y: 0, bulge: 1 },
          ],
        },
      ],
    },
  })
})
