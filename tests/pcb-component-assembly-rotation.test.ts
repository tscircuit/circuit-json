import { expect, test } from "bun:test"
import { pcb_component } from "src/pcb/pcb_component"

test("round trips assembly rotations separately from CAD pin 1", () => {
  const footprint = {
    type: "pcb_component",
    pcb_component_id: "pcb_component_1",
    source_component_id: "source_component_1",
    center: { x: 0, y: 0 },
    layer: "top",
    rotation: 0,
    width: 4,
    height: 4,
    supplier_pin1_location_map: { jlcpcb: "leftside_top" },
  }

  expect(pcb_component.parse(footprint)).not.toHaveProperty(
    "supplier_assembly_rotation_offset_map",
  )
  expect(
    pcb_component.parse({
      ...footprint,
      supplier_assembly_rotation_offset_map: { jlcpcb: -90, pcbway: 0 },
    }),
  ).toMatchObject({
    supplier_pin1_location_map: { jlcpcb: "leftside_top" },
    supplier_assembly_rotation_offset_map: { jlcpcb: -90, pcbway: 0 },
  })
  expect(() =>
    pcb_component.parse({
      ...footprint,
      supplier_assembly_rotation_offset_map: { jlcpcb: Infinity },
    }),
  ).toThrow()
})
