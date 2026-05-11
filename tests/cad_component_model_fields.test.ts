import { test, expect } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

test("cad_component.model_object_fit defaults to contain_within_bounds", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-default-fit",
    pcb_component_id: "pcb-default-fit",
    source_component_id: "src-default-fit",
    position: { x: 0, y: 0, z: 0 },
  })

  expect(component.model_object_fit).toBe("contain_within_bounds")
})

test("cad_component accepts model board/anchor fields", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-model-fields",
    pcb_component_id: "pcb-model-fields",
    source_component_id: "src-model-fields",
    position: { x: 1, y: 2, z: 3 },
    model_board_normal_direction: "z+",
    model_origin_position: { x: 10, y: 20, z: 30 },
    model_origin_alignment: "bottom_center_of_component",
    model_object_fit: "fill_bounds",
  })

  expect(component.model_board_normal_direction).toBe("z+")
  expect(component.model_origin_position).toEqual({ x: 10, y: 20, z: 30 })
  expect(component.model_origin_alignment).toBe("bottom_center_of_component")
  expect(component.model_object_fit).toBe("fill_bounds")
})

test("cad_component accepts show_as_bounding_box", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-bounding-box",
    pcb_component_id: "pcb-bounding-box",
    source_component_id: "src-bounding-box",
    position: { x: 0, y: 0, z: 0 },
    show_as_bounding_box: true,
  })

  expect(component.show_as_bounding_box).toBe(true)
})
