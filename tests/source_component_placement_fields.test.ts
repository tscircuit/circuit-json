import { test, expect } from "bun:test"
import { source_component_base } from "src/source/base/source_component_base"

test("source_component_base accepts placement fields", () => {
  const data = {
    type: "source_component",
    source_component_id: "source_component_1",
    name: "C1",
    place_near_selector: "U1.VCC",
    place_near_port_id: "source_port_5",
    facing_pad_port_id: "source_port_10",
    place_near_max_distance: 0.005,
  }

  const parsed = source_component_base.parse(data)

  expect(parsed.place_near_selector).toBe("U1.VCC")
  expect(parsed.place_near_port_id).toBe("source_port_5")
  expect(parsed.facing_pad_port_id).toBe("source_port_10")
  expect(parsed.place_near_max_distance).toBeCloseTo(0.005)
})
