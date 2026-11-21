import { expect, test } from "bun:test"
import { source_component_base } from "../src/source/base/source_component_base"

test.failing("source components preserve customer-supplied assembly intent", () => {
  const sourceComponent = source_component_base.parse({
    type: "source_component",
    source_component_id: "source_component_module",
    name: "U1",
    manufacturer_part_number: "OSM-S-AM62L",
    customer_supplied: true,
  })

  expect(sourceComponent).toHaveProperty("customer_supplied", true)
})
