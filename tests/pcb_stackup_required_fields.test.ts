import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("pcb_stackup requires board, layers, and copper/dielectric thickness", () => {
  const minimal = {
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    layers: [{ layer_type: "soldermask" }],
  }
  const { pcb_board_id, ...withoutBoard } = minimal
  const { layers, ...withoutLayers } = minimal

  expect(pcb_stackup.safeParse(minimal).success).toBe(true)
  for (const input of [
    withoutBoard,
    withoutLayers,
    { ...minimal, layers: [] },
    { ...minimal, layers: [{ layer_type: "copper", thickness: 0.035 }] },
    { ...minimal, layers: [{ layer_type: "copper", layer: "top" }] },
    { ...minimal, layers: [{ layer_type: "dielectric" }] },
  ]) {
    expect(pcb_stackup.safeParse(input).success).toBe(false)
  }
})
