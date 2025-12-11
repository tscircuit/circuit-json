import { expect, test } from "bun:test"
import { pcb_group } from "src/pcb/pcb_group"

const baseGroup = {
  type: "pcb_group" as const,
  pcb_group_id: "pcb_group_1",
  source_group_id: "source_group_1",
  center: { x: 0, y: 0 },
  pcb_component_ids: [] as const,
}

test("pcb_group allows position metadata fields", () => {
  const parsed = pcb_group.parse({
    ...baseGroup,
    display_offset_x: "1mm",
    display_offset_y: "-1mm",
    position_mode: "relative_to_group_anchor",
    positioned_relative_to_pcb_group_id: "pcb_group_2",
    positioned_relative_to_pcb_board_id: "pcb_board_1",
  })

  expect(parsed.display_offset_x).toBe("1mm")
  expect(parsed.display_offset_y).toBe("-1mm")
  expect(parsed.position_mode).toBe("relative_to_group_anchor")
  expect(parsed.positioned_relative_to_pcb_group_id).toBe("pcb_group_2")
  expect(parsed.positioned_relative_to_pcb_board_id).toBe("pcb_board_1")
})

test("pcb_group rejects invalid position_mode", () => {
  expect(() =>
    pcb_group.parse({
      ...baseGroup,
      position_mode: "invalid",
    }),
  ).toThrowError()
})
