import { expect, test } from "bun:test"
import { cad_component, source_printed_part, any_circuit_element } from "../src"

test("printed parts preserve optional material and color and CAD preserves its color override", () => {
  for (const material of ["pla", "petg", "nylon"] as const) {
    const source = source_printed_part.parse({
      type: "source_component",
      ftype: "printedpart",
      source_component_id: "source_component_1",
      name: "BRACKET",
      material,
      color: " #ff8800 ",
    })
    expect(any_circuit_element.parse(source)).toMatchObject({
      material,
      color: "#ff8800",
    })
  }
  const cad = cad_component.parse({
    type: "cad_component",
    cad_component_id: "cad_component_1",
    source_component_id: "source_component_1",
    position: { x: 0, y: 0, z: 0 },
    color: "red",
  })
  expect(any_circuit_element.parse(cad)).toMatchObject({ color: "red" })
  expect(
    source_printed_part.safeParse({
      type: "source_component",
      ftype: "printedpart",
      source_component_id: "source_component_1",
      name: "BRACKET",
      material: "abs",
    }).success,
  ).toBe(false)
  expect(cad_component.safeParse({ ...cad, color: " " }).success).toBe(false)
  expect(
    source_printed_part.parse({
      type: "source_component",
      ftype: "printedpart",
      source_component_id: "source_component_1",
      name: "BRACKET",
    }),
  ).not.toHaveProperty("material")
})
