import { expect, test } from "bun:test"
import {
  any_circuit_element,
  type DrcCategory,
  drc_category,
  source_property_ignored_warning,
} from "../src"

const validCategories = [
  "netlist",
  "pin_specification",
  "placement",
  "routing",
  "unknown",
] as const satisfies readonly DrcCategory[]

const warning = {
  type: "source_property_ignored_warning" as const,
  source_component_id: "source_component_1",
  property_name: "exampleProperty",
  message: "The example property was ignored",
}

test("source property warnings preserve valid DRC categories", () => {
  for (const category of validCategories) {
    expect(drc_category.parse(category)).toBe(category)
    expect(
      source_property_ignored_warning.parse({
        ...warning,
        drc_category: category,
      }).drc_category,
    ).toBe(category)
  }

  expect(
    source_property_ignored_warning.parse(warning).drc_category,
  ).toBeUndefined()
  expect(
    source_property_ignored_warning.safeParse({
      ...warning,
      drc_category: "invalid",
    }).success,
  ).toBe(false)

  const parsedCircuitElement = any_circuit_element.parse({
    ...warning,
    drc_category: "unknown",
  })
  expect(parsedCircuitElement).toMatchObject({ drc_category: "unknown" })
})
