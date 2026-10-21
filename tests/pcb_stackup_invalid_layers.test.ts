import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("pcb_stackup rejects unknown layer types and references", () => {
  const minimal = {
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    layers: [{ layer_type: "copper", layer: "top", thickness: 0.035 }],
  }

  expect(pcb_stackup.safeParse(minimal).success).toBe(true)
  for (const layer of [
    { ...minimal.layers[0], layer_type: "unknown" },
    { ...minimal.layers[0], layer: "inner99" },
    { ...minimal.layers[0], layer: { name: "inner99" } },
    { layer_type: "dielectric", thickness: 1, dielectric_type: "unknown" },
  ]) {
    expect(pcb_stackup.safeParse({ ...minimal, layers: [layer] }).success).toBe(
      false,
    )
  }
})
