import { expect, test } from "bun:test"
import { pcb_component } from "src/pcb/pcb_component"

const baseComponent = {
  type: "pcb_component" as const,
  pcb_component_id: "pcb_component_1",
  source_component_id: "source_component_1",
  center: { x: 0, y: 0 },
  layer: "top" as const,
  rotation: 0,
  width: 1,
  height: 1,
}

const positionModes = ["packed", "relative_to_group_anchor", "none"] as const

for (const position_mode of positionModes) {
  test(`pcb_component allows position_mode ${position_mode}`, () => {
    const parsed = pcb_component.parse({
      ...baseComponent,
      position_mode,
    })

    expect(parsed.position_mode).toBe(position_mode)
  })
}

test("pcb_component allows positioned_relative_to_pcb_group_id", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    positioned_relative_to_pcb_group_id: "pcb_group_1",
  })

  expect(parsed.positioned_relative_to_pcb_group_id).toBe("pcb_group_1")
})

test("pcb_component rejects invalid position_mode", () => {
  expect(() =>
    pcb_component.parse({
      ...baseComponent,
      position_mode: "invalid",
    }),
  ).toThrowError()
})
