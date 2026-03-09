import { test, expect } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

test("cad_component.model_object_fit defaults to scale_to_bounds", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-default-fit",
    pcb_component_id: "pcb-default-fit",
    source_component_id: "src-default-fit",
    position: { x: 0, y: 0, z: 0 },
  })

  expect(component.model_object_fit).toBe("scale_to_bounds")
})

test("cad_component accepts model board/origin fields", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-model-fields",
    pcb_component_id: "pcb-model-fields",
    source_component_id: "src-model-fields",
    position: { x: 1, y: 2, z: 3 },
    model_board_normal_direction: "z+",
    model_origin: { x: 10, y: 20, z: 30 },
    model_origin_alignment: "center_xy_board_z",
    model_object_fit: "scale_to_bounds",
  })

  expect(component.model_board_normal_direction).toBe("z+")
  expect(component.model_origin).toEqual({ x: 10, y: 20, z: 30 })
  expect(component.model_origin_alignment).toBe("center_xy_board_z")
  expect(component.model_object_fit).toBe("scale_to_bounds")
})
