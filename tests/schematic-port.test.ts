import { expect, test } from "bun:test"
import { schematic_port } from "src/schematic/schematic_port"

const baseSchematicPort = {
  type: "schematic_port" as const,
  source_port_id: "source_port_0",
  center: { x: 0, y: 0 },
}

test("schematic ports can identify internal circuit port roles", () => {
  const internalCircuitPort = schematic_port.parse({
    ...baseSchematicPort,
    schematic_port_id: "schematic_port_internal",
    is_internal_circuit_port: true,
  })
  const overlappingPort = schematic_port.parse({
    ...baseSchematicPort,
    schematic_port_id: "schematic_port_overlapping",
    is_overlapping_internal_circuit_port: true,
  })

  expect(internalCircuitPort.is_internal_circuit_port).toBe(true)
  expect(overlappingPort.is_overlapping_internal_circuit_port).toBe(true)
})

test("schematic ports accept an optional display pin-label font size", () => {
  const port = schematic_port.parse({
    ...baseSchematicPort,
    schematic_port_id: "schematic_port_with_font_size",
    display_pin_label_font_size: 0.1,
  })

  expect(port.display_pin_label_font_size).toBe(0.1)

  const portWithoutOverride = schematic_port.parse({
    ...baseSchematicPort,
    schematic_port_id: "schematic_port_without_font_size",
  })
  expect(portWithoutOverride.display_pin_label_font_size).toBeUndefined()
})

test("schematic ports accept styled display pin-label runs", () => {
  const port = schematic_port.parse({
    ...baseSchematicPort,
    schematic_port_id: "schematic_port_with_text_runs",
    display_pin_label: "ABC",
    display_pin_label_text_runs: [
      { text: "A" },
      { text: "B", overline: true },
      { text: "C" },
    ],
  })

  expect(port.display_pin_label_text_runs).toEqual([
    { text: "A" },
    { text: "B", overline: true },
    { text: "C" },
  ])
})

test("schematic ports reject invalid display pin-label font sizes", () => {
  for (const display_pin_label_font_size of [
    0,
    -0.1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    "0.1mm",
    "0.1",
    "default",
    "sm",
    "large",
    null,
    {},
  ]) {
    expect(
      schematic_port.safeParse({
        ...baseSchematicPort,
        schematic_port_id: "schematic_port_invalid_font_size",
        display_pin_label_font_size,
      }).success,
    ).toBe(false)
  }
})
