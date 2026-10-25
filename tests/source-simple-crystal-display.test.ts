import { expect, test } from "bun:test"
import {
  type SourceSimpleCrystal,
  type SourceSimpleCrystalInput,
  any_circuit_element,
  any_source_component,
  source_simple_crystal,
} from "../src"

test("crystal display values survive schema parsing and JSON round trips", () => {
  const crystal = {
    type: "source_component",
    ftype: "simple_crystal",
    source_component_id: "source_component_1",
    name: "Y1",
    frequency: 32768,
    load_capacitance: 12.5e-12,
    display_frequency: "32.768kHz",
    display_load_capacitance: "12.5pF",
  } satisfies SourceSimpleCrystal

  for (const schema of [
    source_simple_crystal,
    any_source_component,
    any_circuit_element,
  ]) {
    expect(schema.parse(crystal)).toEqual(crystal)
    expect(schema.parse(JSON.parse(JSON.stringify(crystal)))).toEqual(crystal)
    expect(
      schema.safeParse({ ...crystal, display_frequency: 32768 }).success,
    ).toBe(false)
    expect(
      schema.safeParse({ ...crystal, display_load_capacitance: 12.5 }).success,
    ).toBe(false)

    const { display_frequency, display_load_capacitance, ...legacyCrystal } =
      crystal
    expect(schema.parse(legacyCrystal)).toEqual(legacyCrystal)
  }
})

test("crystal schemas normalize frequency and load capacitance units", () => {
  const crystal = {
    type: "source_component",
    ftype: "simple_crystal",
    source_component_id: "source_component_1",
    name: "Y1",
    frequency: "32.768kHz",
    load_capacitance: "12.5pF",
  } satisfies SourceSimpleCrystalInput

  for (const schema of [
    source_simple_crystal,
    any_source_component,
    any_circuit_element,
  ]) {
    expect(schema.parse(crystal)).toEqual({
      ...crystal,
      frequency: 32768,
      load_capacitance: 12.5e-12,
    })
    expect(
      schema.parse({ ...crystal, frequency: "16MHz", load_capacitance: "9pF" }),
    ).toEqual({
      ...crystal,
      frequency: 16000000,
      load_capacitance: 9e-12,
    })
    const { load_capacitance, ...crystalWithoutLoadCapacitance } = crystal
    expect(schema.parse(crystalWithoutLoadCapacitance)).toEqual({
      ...crystalWithoutLoadCapacitance,
      frequency: 32768,
    })
  }
})
