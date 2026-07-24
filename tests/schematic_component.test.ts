import { expect, test } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

const baseComponent = {
  type: "schematic_component" as const,
  size: { width: 10, height: 5 },
  center: { x: 0, y: 0 },
  schematic_component_id: "schem_comp_1",
}

test("schematic_component defaults to box with pins", () => {
  const component = schematic_component.parse(baseComponent)

  expect(component.is_box_with_pins).toBe(true)
})

test("schematic_component allows disabling box with pins", () => {
  const component = schematic_component.parse({
    ...baseComponent,
    is_box_with_pins: false,
  })

  expect(component.is_box_with_pins).toBe(false)
})

test("schematic_component allows schematic_symbol_id", () => {
  const component = schematic_component.parse({
    ...baseComponent,
    schematic_symbol_id: "schematic_symbol_1",
  })

  expect(component.schematic_symbol_id).toBe("schematic_symbol_1")
})

test("schematic_component accepts dynamic pin styles and port labels", () => {
  const component = schematic_component.parse({
    ...baseComponent,
    pin_styles: {
      pin1: { left_margin: 1 },
    },
    port_labels: {
      pin1: "VCC",
    },
  })

  expect(component.pin_styles?.pin1?.left_margin).toBe(1)
  expect(component.port_labels).toEqual({ pin1: "VCC" })
})
