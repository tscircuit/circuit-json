import { test, expect } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

test("cad_component.anchor_alignment defaults to center", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-default",
    pcb_component_id: "pcb-default",
    source_component_id: "src-default",
    position: { x: 0, y: 0, z: 0 },
  })

  expect(component.anchor_alignment).toBe("center")
})

test("cad_component.anchor_alignment accepts center_of_component_on_board_surface", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-xy-center",
    pcb_component_id: "pcb-xy-center",
    source_component_id: "src-xy-center",
    position: { x: 1, y: 2, z: 3 },
    anchor_alignment: "center_of_component_on_board_surface",
  })

  expect(component.anchor_alignment).toBe(
    "center_of_component_on_board_surface",
  )
})
