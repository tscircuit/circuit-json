import { test, expect } from "bun:test"
import { source_component_pins_underspecified_warning } from "src/source/source_component_pins_underspecified_warning"

test("source_component_pins_underspecified_warning schema is defined", () => {
  expect(source_component_pins_underspecified_warning).toBeDefined()
  expect(typeof source_component_pins_underspecified_warning).toBe("object")
})
