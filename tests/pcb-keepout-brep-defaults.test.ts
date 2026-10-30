import { expect, test } from "bun:test"
import { pcb_keepout } from "src"

test("BREP keepouts default to no holes and require a boundary", () => {
  const input = {
    type: "pcb_keepout",
    shape: "brep",
    pcb_keepout_id: "keepout_1",
    layers: ["top"],
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 3, y: 0, bulge: -1 },
          { x: -3, y: 0, bulge: -1 },
        ],
      },
    },
  }
  const parsed = pcb_keepout.parse(input)
  expect(parsed.shape).toBe("brep")
  if (parsed.shape !== "brep") throw new Error("Expected a BREP keepout")
  expect(parsed.brep_shape.inner_rings).toEqual([])
  expect(pcb_keepout.safeParse({ ...input, brep_shape: {} }).success).toBe(
    false,
  )
})
