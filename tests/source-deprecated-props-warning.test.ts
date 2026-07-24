import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_deprecated_props_warning } from "../src/source/source_deprecated_props_warning"

test("parses a deprecated source component prop warning", () => {
  const warning = source_deprecated_props_warning.parse({
    type: "source_deprecated_props_warning",
    source_component_id: "source_component_0",
    prop_name: "pin_spacing",
    message: "pin_spacing is deprecated",
  })

  expect(warning).toMatchObject({
    type: "source_deprecated_props_warning",
    error_type: "source_deprecated_props_warning",
    source_component_id: "source_component_0",
    prop_name: "pin_spacing",
  })
  expect(warning.source_deprecated_props_warning_id).toStartWith(
    "source_deprecated_props_warning",
  )
})

test("any_circuit_element includes deprecated source group prop warnings", () => {
  const warning = any_circuit_element.parse({
    type: "source_deprecated_props_warning",
    source_group_id: "source_group_0",
    prop_name: "layout_mode",
    message: "layout_mode is deprecated",
  })

  expect(warning.type).toBe("source_deprecated_props_warning")
})
