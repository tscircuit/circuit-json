import { test, expect } from "bun:test"
import { source_component_base } from "../src/source/base/source_component_base"

test("source_component accepts show_as_bounding_box", () => {
  const component = source_component_base.parse({
    type: "source_component",
    source_component_id: "source-bounding-box",
    name: "U1",
    show_as_bounding_box: true,
  })

  expect(component.show_as_bounding_box).toBe(true)
})
