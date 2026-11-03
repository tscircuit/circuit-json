import { expect, test } from "bun:test"
import { pcb_copper_pour } from "src/pcb/pcb_copper_pour"

test("preserves ordered copper clearance exceptions and fixed geometry metadata", () => {
  const pour = {
    type: "pcb_copper_pour",
    pcb_copper_pour_id: "pcb_copper_pour_earth",
    layer: "top",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 10 },
    ],
    clearance: 0.1397,
    clearance_rules: [
      {
        clearance: 4.14,
        source_net_ids: ["source_net_earth"],
        object_types: ["smtpad", "trace"],
      },
      { clearance: 1.6, source_net_ids: ["source_net_earth"] },
    ],
    is_static: true,
  }
  expect(pcb_copper_pour.parse(pour)).toMatchObject(pour)
  expect(pcb_copper_pour.safeParse({ ...pour, clearance: -1 }).success).toBe(
    false,
  )
  expect(
    pcb_copper_pour.safeParse({
      ...pour,
      clearance_rules: [{ clearance: Infinity }],
    }).success,
  ).toBe(false)
  expect(
    pcb_copper_pour.safeParse({
      ...pour,
      clearance_rules: [{ clearance: 0.2, object_types: ["unknown"] }],
    }).success,
  ).toBe(false)
})
