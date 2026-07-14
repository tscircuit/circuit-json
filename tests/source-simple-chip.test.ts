import { expect, test } from "bun:test"
import { source_simple_chip } from "src/source/source_simple_chip"

test("source_simple_chip accepts an explicit simulation boundary", () => {
  const chip = source_simple_chip.parse({
    type: "source_component",
    source_component_id: "source_component_1",
    name: "U1",
    ftype: "simple_chip",
    is_simulation_boundary: true,
  })

  expect(chip.is_simulation_boundary).toBe(true)
})
