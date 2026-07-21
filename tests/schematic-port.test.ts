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
