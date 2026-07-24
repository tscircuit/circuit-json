import { expect, test } from "bun:test"
import { source_component_base } from "../src/source/base/source_component_base"

test("source_component_base allows partial supplier part numbers", () => {
  const component = source_component_base.parse({
    type: "source_component",
    source_component_id: "source_component_1",
    name: "Resistor",
    supplier_part_numbers: {
      jlcpcb: ["C12345"],
    },
  })

  expect(component.supplier_part_numbers).toEqual({
    jlcpcb: ["C12345"],
  })
})
