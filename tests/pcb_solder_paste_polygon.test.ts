import { expect, test } from "bun:test"
import { pcb_solder_paste } from "src/pcb/pcb_solder_paste"

test("pcb_solder_paste parses the polygon shape", () => {
  const pcbSolderPaste = pcb_solder_paste.parse({
    type: "pcb_solder_paste",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1.5, y: 1 },
      { x: 0, y: 1 },
    ],
    layer: "top",
    pcb_component_id: "pcb_component_1",
    pcb_smtpad_id: "pcb_smtpad_1",
  })

  if (pcbSolderPaste.shape !== "polygon") {
    throw new Error("Expected polygon")
  }
  expect(pcbSolderPaste.pcb_solder_paste_id).toStartWith("pcb_solder_paste")
  expect(pcbSolderPaste.points).toEqual([
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1.5, y: 1 },
    { x: 0, y: 1 },
  ])
  expect(pcbSolderPaste.layer).toBe("top")
})
