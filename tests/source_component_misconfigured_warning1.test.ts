import { expect, test } from "bun:test"
import { source_component_misconfigured_warning } from "../src/source/source_component_misconfigured_warning"

test("source_component_misconfigured_warning parses", () => {
  const warning = source_component_misconfigured_warning.parse({
    type: "source_component_misconfigured_warning",
    message: "Pins pin1 (EN) and pin2 (GND) on SW1 are internally connected",
    source_component_ids: ["source_component_0"],
    source_port_ids: ["source_port_0", "source_port_1"],
  })

  expect(warning.warning_type).toBe("source_component_misconfigured_warning")
  expect(warning.source_component_misconfigured_warning_id).toStartWith(
    "source_component_misconfigured_warning",
  )
})
