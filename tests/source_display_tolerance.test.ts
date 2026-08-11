import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  source_simple_capacitor,
  source_simple_inductor,
  source_simple_resistor,
} from "../src/source"

test("source_simple_capacitor preserves display_tolerance", () => {
  const capacitor = source_simple_capacitor.parse({
    type: "source_component",
    ftype: "simple_capacitor",
    source_component_id: "capacitor1",
    name: "C1",
    capacitance: "10uF",
    display_tolerance: "±20%",
  })

  expect(capacitor.display_tolerance).toBe("±20%")
})

test("source_simple_resistor preserves display_tolerance", () => {
  const resistor = source_simple_resistor.parse({
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "resistor1",
    name: "R1",
    resistance: "1kΩ",
    display_tolerance: "±1%",
  })

  expect(resistor.display_tolerance).toBe("±1%")
})

test("source_simple_inductor preserves display_tolerance", () => {
  const inductor = source_simple_inductor.parse({
    type: "source_component",
    ftype: "simple_inductor",
    source_component_id: "inductor1",
    name: "L1",
    inductance: "10uH",
    display_tolerance: "±10%",
  })

  expect(inductor.display_tolerance).toBe("±10%")
})

test("any_circuit_element preserves display_tolerance", () => {
  const components = [
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "capacitor1",
      name: "C1",
      capacitance: "10uF",
      display_tolerance: "±20%",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "resistor1",
      name: "R1",
      resistance: "1kΩ",
      display_tolerance: "±1%",
    },
    {
      type: "source_component",
      ftype: "simple_inductor",
      source_component_id: "inductor1",
      name: "L1",
      inductance: "10uH",
      display_tolerance: "±10%",
    },
  ]

  expect(
    components.map((component) => {
      const parsedComponent = any_circuit_element.parse(component)
      return "display_tolerance" in parsedComponent
        ? parsedComponent.display_tolerance
        : undefined
    }),
  ).toEqual(["±20%", "±1%", "±10%"])
})
