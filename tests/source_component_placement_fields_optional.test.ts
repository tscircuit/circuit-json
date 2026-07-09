import { test, expect } from "bun:test"
import { source_component_base } from "src/source/base/source_component_base"

test("placement fields are optional on source_component_base", () => {
  const data = {
    type: "source_component",
    source_component_id: "source_component_1",
    name: "R1",
  }

  const parsed = source_component_base.parse(data)

  expect(parsed.place_near_selector).toBeUndefined()
  expect(parsed.place_near_port_id).toBeUndefined()
  expect(parsed.facing_pad_port_id).toBeUndefined()
  expect(parsed.place_near_max_distance).toBeUndefined()
})
