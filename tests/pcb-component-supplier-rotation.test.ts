import { expect, test } from "bun:test"
import { pcb_component } from "../src"

test("PCB component parsing preserves the supplier rotation offsets, including zero", () => {
  const component = {
    type: "pcb_component",
    source_component_id: "source_component_0",
    center: { x: 0, y: 0 },
    layer: "top",
    rotation: 180,
    width: 4,
    height: 2,
  }
  expect(
    pcb_component.parse(component).supplier_rotation_offset_map,
  ).toBeUndefined()
  expect(
    pcb_component.parse({
      ...component,
      supplier_rotation_offset_map: { jlcpcb: 0, pcbway: 90 },
    }).supplier_rotation_offset_map,
  ).toEqual({ jlcpcb: 0, pcbway: 90 })
})
