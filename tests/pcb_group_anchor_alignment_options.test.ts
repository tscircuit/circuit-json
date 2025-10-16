import { test, expect } from "bun:test"
import { pcb_group } from "../src/pcb/pcb_group"

test("pcb_group with all anchor_alignment options", () => {
  const alignments = [
    "center",
    "top_left",
    "top_right",
    "bottom_left",
    "bottom_right",
  ] as const

  for (const alignment of alignments) {
    const group = pcb_group.parse({
      type: "pcb_group",
      source_group_id: "g1",
      width: 10,
      height: 10,
      center: { x: 0, y: 0 },
      pcb_component_ids: [],
      anchor_position: { x: 0, y: 0 },
      anchor_alignment: alignment,
    })

    expect(group.anchor_alignment).toBe(alignment)
  }
})
