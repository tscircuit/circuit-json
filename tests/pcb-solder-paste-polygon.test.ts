import { expect, test } from "bun:test"
import {
  pcb_solder_paste,
  type PcbSolderPastePolygon,
} from "src/pcb/pcb_solder_paste"

test("polygon solder paste preserves absolute contours and pad links", () => {
  const points = [
    { x: 10, y: -4 },
    { x: 12, y: -4 },
    { x: 12, y: -3 },
    { x: 11, y: -3.5 },
    { x: 10, y: -3 },
  ]
  for (const layer of ["top", "bottom"] as const) {
    const input = {
      type: "pcb_solder_paste",
      shape: "polygon",
      layer,
      points,
      holes: [
        [
          { x: 10.5, y: -3.9 },
          { x: 11, y: -3.9 },
          { x: 10.75, y: -3.8 },
        ],
      ],
      pcb_smtpad_id: "pcb_smtpad_1",
      pcb_component_id: "pcb_component_1",
      pcb_group_id: "pcb_group_1",
      subcircuit_id: "subcircuit_1",
    }
    const paste = pcb_solder_paste.parse(input)
    if (paste.shape !== "polygon") throw new Error("Expected polygon paste")
    const typedPaste: PcbSolderPastePolygon = paste
    expect(typedPaste).toMatchObject(input)
    expect(paste.pcb_solder_paste_id).toStartWith("pcb_solder_paste")
    expect(
      pcb_solder_paste.safeParse({ ...input, points: points.slice(0, 2) })
        .success,
    ).toBe(false)
    expect(
      pcb_solder_paste.safeParse({
        ...input,
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
      }).success,
    ).toBe(false)
    expect(
      pcb_solder_paste.safeParse({
        ...input,
        holes: [[{ x: NaN, y: 0 }, ...points]],
      }).success,
    ).toBe(false)
  }
})
