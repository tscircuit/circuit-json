import { expect, test } from "bun:test"
import { schematic_port } from "src/schematic/schematic_port"

test("schematic ports can suppress electrical rule checks", () => {
  const schematicPort = schematic_port.parse({
    type: "schematic_port",
    schematic_port_id: "schematic_port_0",
    source_port_id: "source_port_0",
    center: { x: 4.5, y: -2 },
    no_erc: true,
  })

  expect(schematicPort.no_erc).toBe(true)
})
