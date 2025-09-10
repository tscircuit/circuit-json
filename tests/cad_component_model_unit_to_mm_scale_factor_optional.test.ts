import { test, expect } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

test("cad_component.model_unit_to_mm_scale_factor is optional", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad1",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
    position: { x: 0, y: 0, z: 0 },
  })
  expect(component.model_unit_to_mm_scale_factor).toBeUndefined()
})

test("cad_component.model_unit_to_mm_scale_factor parses number", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad2",
    pcb_component_id: "pcb2",
    source_component_id: "src2",
    position: { x: 0, y: 0, z: 0 },
    model_unit_to_mm_scale_factor: 25.4,
  })
  expect(component.model_unit_to_mm_scale_factor).toBe(25.4)
})
