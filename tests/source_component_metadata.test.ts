import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_simple_capacitor,
  source_simple_chip,
  source_simple_resistor,
} from "../src"

const components = [
  {
    schema: source_simple_chip,
    component: {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_U1",
      name: "U1",
    },
  },
  {
    schema: source_simple_resistor,
    component: {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_R1",
      name: "R1",
      resistance: 1000,
    },
  },
  {
    schema: source_simple_capacitor,
    component: {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_C1",
      name: "C1",
      capacitance: 0.000001,
    },
  },
] as const

test("source components preserve opaque metadata through parsing and JSON round trips", () => {
  const metadata = {
    "spice.model": "OPA388.lib",
    "mytool.constraint": {
      enabled: true,
      max_current: 0.25,
      matching_groups: ["input", "feedback"],
      optional_limit: null,
      nested: [{ pin: 1 }, { pin: 2 }],
    },
  }

  for (const { schema, component } of components) {
    const input = { ...component, metadata }
    const parsed = schema.parse(input)
    expect(parsed).toEqual(input)
    expect(any_circuit_element.parse(input)).toEqual(input)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
    ).toEqual(input)
  }
})

test("source component metadata is optional and allows an empty record", () => {
  for (const { schema, component } of components) {
    expect(schema.parse(component)).not.toHaveProperty("metadata")
    expect(any_circuit_element.parse(component)).not.toHaveProperty("metadata")

    const input = { ...component, metadata: {} }
    expect(schema.parse(input)).toEqual(input)
    expect(any_circuit_element.parse(input)).toEqual(input)
  }
})

test("source component metadata must be a record", () => {
  for (const metadata of [null, "model.lib", 42, true, ["model.lib"]]) {
    for (const { schema, component } of components) {
      const input = { ...component, metadata }
      expect(schema.safeParse(input).success).toBe(false)
      expect(any_circuit_element.safeParse(input).success).toBe(false)
    }
  }
})

test("metadata does not replace required typed component properties", () => {
  const resistor = {
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "source_component_R1",
    name: "R1",
    metadata: { resistance: 1000 },
  }

  expect(source_simple_resistor.safeParse(resistor).success).toBe(false)
  expect(any_circuit_element.safeParse(resistor).success).toBe(false)
})
