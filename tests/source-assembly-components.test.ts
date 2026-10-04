import { expect, test } from "bun:test"
import {
  any_circuit_element,
  any_source_component,
  cad_component,
  source_motor,
  source_printed_part,
  source_subassembly,
  type SourceMotor,
  type SourcePrintedPart,
  type SourceSubassembly,
} from "../src"

const assemblyTypes = [
  { schema: source_printed_part, ftype: "printedpart" },
  { schema: source_subassembly, ftype: "subassembly" },
  { schema: source_motor, ftype: "motor" },
] as const

for (const { schema, ftype } of assemblyTypes) {
  test(`${ftype} preserves source identity and CAD references`, () => {
    const component = {
      type: "source_component",
      ftype,
      source_component_id: `source_${ftype}_1`,
      name: "PART1",
      display_name: "Assembly part",
      source_group_id: "source_group_1",
      subcircuit_id: "subcircuit_1",
      manufacturer_part_number: "PART-001",
    } satisfies SourcePrintedPart | SourceSubassembly | SourceMotor

    expect(schema.parse(component)).toEqual(component)
    expect(any_source_component.parse(component)).toEqual(component)
    expect(any_circuit_element.parse(component)).toEqual(component)
    expect(
      cad_component.parse({
        type: "cad_component",
        cad_component_id: "cad_1",
        source_component_id: component.source_component_id,
        position: { x: 0, y: 0, z: 0 },
        model_stl_url: "https://example.com/part.stl",
      }).source_component_id,
    ).toBe(component.source_component_id)
  })

  test(`${ftype} requires its discriminator, source ID, and name`, () => {
    const component = {
      type: "source_component",
      ftype,
      source_component_id: "source_1",
      name: "PART1",
    }
    for (const field of ["type", "ftype", "source_component_id", "name"]) {
      expect(
        schema.safeParse({ ...component, [field]: undefined }).success,
      ).toBe(false)
    }
    expect(
      schema.safeParse({ ...component, ftype: "simple_chip" }).success,
    ).toBe(false)
    for (const parser of [any_source_component, any_circuit_element]) {
      expect(
        parser.safeParse({ ...component, ftype: "unknown_part" }).success,
      ).toBe(false)
    }
  })
}
