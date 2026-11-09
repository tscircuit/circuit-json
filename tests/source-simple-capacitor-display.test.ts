import { expect, test } from "bun:test"
import {
  type SourceSimpleCapacitor,
  any_circuit_element,
  any_source_component,
  source_simple_capacitor,
} from "../src"

test("capacitor voltage display survives parsing without changing numeric ratings", () => {
  const capacitor = {
    type: "source_component",
    ftype: "simple_capacitor",
    source_component_id: "source_component_1",
    name: "C1",
    capacitance: 4.7e-6,
    max_voltage_rating: 50,
    display_capacitance: "4.7uF",
    display_max_voltage_rating: "50V",
  } satisfies SourceSimpleCapacitor

  for (const schema of [
    source_simple_capacitor,
    any_source_component,
    any_circuit_element,
  ]) {
    expect(schema.parse(capacitor)).toEqual(capacitor)
    expect(schema.parse(JSON.parse(JSON.stringify(capacitor)))).toEqual(
      capacitor,
    )
    expect(
      schema.safeParse({ ...capacitor, display_max_voltage_rating: 50 })
        .success,
    ).toBe(false)
    const { display_max_voltage_rating, ...legacyCapacitor } = capacitor
    expect(schema.parse(legacyCapacitor)).toEqual(legacyCapacitor)
  }
})
