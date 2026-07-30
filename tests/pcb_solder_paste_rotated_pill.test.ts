import { test, expect } from "bun:test"
import { pcb_solder_paste } from "src/pcb/pcb_solder_paste"

test("pcb_solder_paste parses the rotated_pill shape", () => {
  const paste = pcb_solder_paste.parse({
    type: "pcb_solder_paste",
    shape: "rotated_pill",
    x: 1,
    y: 2,
    width: 1.2,
    height: 0.6,
    radius: 0.3,
    ccw_rotation: 45,
    layer: "top",
    pcb_component_id: "pcb_component_1",
    pcb_smtpad_id: "pcb_smtpad_1",
  })

  if (paste.shape !== "rotated_pill") throw new Error("Expected rotated_pill")
  expect(paste.pcb_solder_paste_id.startsWith("pcb_solder_paste")).toBe(true)
  expect(paste.width).toBe(1.2)
  expect(paste.height).toBe(0.6)
  expect(paste.radius).toBe(0.3)
  expect(paste.ccw_rotation).toBe(45)
  expect(paste.layer).toBe("top")
})
