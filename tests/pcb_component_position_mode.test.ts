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

const positionModes = [
  "packed",
  "relative_to_group_anchor",
  "relative_to_another_component",
  "none",
] as const

for (const position_mode of positionModes) {
  test(`pcb_component allows position_mode ${position_mode}`, () => {
    const parsed = pcb_component.parse({
      ...baseComponent,
      position_mode,
    })

    expect(parsed.position_mode).toBe(position_mode)
  })
}

test("pcb_component allows optional anchor positioning fields", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    anchor_position: { x: 10, y: 20 },
    anchor_alignment: "bottom_right",
  })

  expect(parsed.anchor_position).toEqual({ x: 10, y: 20 })
  expect(parsed.anchor_alignment).toBe("bottom_right")
})

test("pcb_component allows positioned_relative_to_pcb_group_id", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    positioned_relative_to_pcb_group_id: "pcb_group_1",
  })

  expect(parsed.positioned_relative_to_pcb_group_id).toBe("pcb_group_1")
})

test("pcb_component allows positioned_relative_to_pcb_board_id", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    positioned_relative_to_pcb_board_id: "pcb_board_1",
  })

  expect(parsed.positioned_relative_to_pcb_board_id).toBe("pcb_board_1")
})

test("pcb_component allows cable_insertion_center", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    cable_insertion_center: { x: 5, y: -3 },
  })

  expect(parsed.cable_insertion_center).toEqual({ x: 5, y: -3 })
})

test("pcb_component allows insertion_direction options", () => {
  const insertionDirections = [
    "from_above",
    "from_left",
    "from_right",
    "from_front",
    "from_back",
  ] as const

  for (const insertion_direction of insertionDirections) {
    const parsed = pcb_component.parse({
      ...baseComponent,
      pcb_component_id: `pcb_component_${insertion_direction}`,
      insertion_direction,
    })

    expect(parsed.insertion_direction).toBe(insertion_direction)
  }
})

test("pcb_component rejects invalid insertion_direction", () => {
  for (const insertion_direction of ["from_side", "from_top", "from_bottom"]) {
    expect(() =>
      pcb_component.parse({
        ...baseComponent,
        insertion_direction,
      }),
    ).toThrowError()
  }
})

test("pcb_component allows display offsets", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    display_offset_x: "1mm",
    display_offset_y: "-2mm",
  })

  expect(parsed.display_offset_x).toBe("1mm")
  expect(parsed.display_offset_y).toBe("-2mm")
})

test("pcb_component allows is_allowed_to_be_off_board", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    is_allowed_to_be_off_board: true,
  })

  expect(parsed.is_allowed_to_be_off_board).toBe(true)
})

test("pcb_component allows optional metadata.kicad_footprint", () => {
  const parsed = pcb_component.parse({
    ...baseComponent,
    metadata: {
      kicad_footprint: {
        footprintName: "Resistor_SMD:R_0603_1608Metric",
        attributes: { smd: true },
      },
    },
  })

  expect(parsed.metadata?.kicad_footprint?.footprintName).toBe(
    "Resistor_SMD:R_0603_1608Metric",
  )
  expect(parsed.metadata?.kicad_footprint?.attributes?.smd).toBe(true)
})

test("pcb_component rejects invalid position_mode", () => {
  expect(() =>
    pcb_component.parse({
      ...baseComponent,
      position_mode: "invalid",
    }),
  ).toThrowError()
})
