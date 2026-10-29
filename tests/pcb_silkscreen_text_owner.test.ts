import { expect, test } from "bun:test"
import { any_circuit_element, pcb_silkscreen_text } from "src"

test("silkscreen text can belong to a board or group without a component", () => {
  const standalone = {
    type: "pcb_silkscreen_text",
    pcb_silkscreen_text_id: "pcb_silkscreen_text_title",
    pcb_group_id: "pcb_group_board",
    subcircuit_id: "subcircuit_board",
    layer: "top",
    text: "RP2040 MOTOR CONTROLLER",
    anchor_position: { x: 3, y: -4 },
  }
  const parsed = pcb_silkscreen_text.parse(standalone)
  expect(parsed.pcb_component_id).toBeUndefined()
  expect(parsed.pcb_group_id).toBe(standalone.pcb_group_id)
  expect(any_circuit_element.safeParse(standalone).success).toBe(true)
  expect(
    pcb_silkscreen_text.parse({
      ...standalone,
      pcb_component_id: "pcb_component_fuse",
    }).pcb_component_id,
  ).toBe("pcb_component_fuse")
  for (const pcb_component_id of [null, 42]) {
    expect(
      pcb_silkscreen_text.safeParse({ ...standalone, pcb_component_id })
        .success,
    ).toBe(false)
  }
})
