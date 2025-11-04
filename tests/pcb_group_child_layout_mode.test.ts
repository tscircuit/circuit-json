import { expect, test } from "bun:test"
import { pcb_group } from "src/pcb/pcb_group"

const childLayoutModes = ["packed", "none"] as const

for (const child_layout_mode of childLayoutModes) {
  test(`pcb_group allows child_layout_mode ${child_layout_mode}`, () => {
    const parsed = pcb_group.parse({
      type: "pcb_group",
      pcb_group_id: "pcb_group_1",
      source_group_id: "source_group_1",
      center: { x: 0, y: 0 },
      pcb_component_ids: [],
      child_layout_mode,
    })

    expect(parsed.child_layout_mode).toBe(child_layout_mode)
  })
}

test("pcb_group rejects invalid child_layout_mode", () => {
  expect(() =>
    pcb_group.parse({
      type: "pcb_group",
      pcb_group_id: "pcb_group_1",
      source_group_id: "source_group_1",
      center: { x: 0, y: 0 },
      pcb_component_ids: [],
      child_layout_mode: "invalid",
    }),
  ).toThrowError()
})
