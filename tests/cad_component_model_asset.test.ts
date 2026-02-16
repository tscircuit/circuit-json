import { test, expect } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

test("cad_component.model_asset parses asset object", () => {
  const component = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad-model-asset",
    pcb_component_id: "pcb-model-asset",
    source_component_id: "src-model-asset",
    position: { x: 0, y: 0, z: 0 },
    model_asset: {
      project_relative_path: "assets/model.step",
      url: "https://example.com/model.step",
      mimetype: "model/step",
    },
  })

  expect(component.model_asset).toEqual({
    project_relative_path: "assets/model.step",
    url: "https://example.com/model.step",
    mimetype: "model/step",
  })
})
