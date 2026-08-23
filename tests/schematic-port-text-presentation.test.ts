import { expect, test } from "bun:test"
import { schematic_port } from "src/schematic/schematic_port"

test("schematic ports preserve pin text presentation", () => {
  const schematicPort = schematic_port.parse({
    type: "schematic_port",
    schematic_port_id: "schematic_port_1",
    source_port_id: "source_port_1",
    center: { x: 0, y: 0 },
    is_pin_name_visible: false,
    is_pin_number_visible: true,
    pin_text_font_size: 0.5,
  })

  expect(schematicPort).toMatchObject({
    is_pin_name_visible: false,
    is_pin_number_visible: true,
    pin_text_font_size: 0.5,
  })
})
