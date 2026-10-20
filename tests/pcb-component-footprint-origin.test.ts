import { expect, test } from "bun:test"
import { pcb_component } from "src/pcb/pcb_component"

test("PCB components preserve a footprint origin distinct from their copper bounds", () => {
  const component = {
    type: "pcb_component",
    pcb_component_id: "pcb_component_1",
    source_component_id: "source_component_1",
    center: { x: 0.135, y: 0.135 },
    layer: "top",
    rotation: 0,
    width: 1.57,
    height: 1.57,
  }
  const footprintOrigin = { x: 0, y: 0 }
  expect(
    pcb_component.parse({ ...component, footprint_origin: footprintOrigin }),
  ).toMatchObject({
    center: component.center,
    footprint_origin: footprintOrigin,
  })
  // Old circuit JSON remains valid and must not invent an origin from its bounds.
  expect(pcb_component.parse(component)).not.toHaveProperty("footprint_origin")
})
