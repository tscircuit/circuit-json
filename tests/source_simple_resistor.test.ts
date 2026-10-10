import { test, expect } from "bun:test"
import { source_simple_resistor } from "../src/source/source_simple_resistor"
import { any_circuit_element } from "../src/any_circuit_element"

const base = {
  type: "source_component",
  ftype: "simple_resistor",
  source_component_id: "R1",
  name: "R1",
  resistance: 10000,
  display_resistance: "10kΩ",
}

test("source_simple_resistor parse preserves display_tolerance", () => {
  const resistor = source_simple_resistor.parse({
    ...base,
    display_tolerance: "5%",
  })

  expect(resistor.ftype).toBe("simple_resistor")
  expect(resistor.resistance).toBe(10000)
  expect(resistor.display_resistance).toBe("10kΩ")
  expect(resistor.display_tolerance).toBe("5%")
})

test("source_simple_resistor accepts an optional display_tolerance string", () => {
  for (const tolerance of [undefined, "5%", "0.1%", "12.5%", "100%"]) {
    const resistor = source_simple_resistor.parse({
      ...base,
      display_tolerance: tolerance,
    })

    if (tolerance === undefined) {
      expect(resistor.display_tolerance).toBeUndefined()
    } else {
      expect(resistor.display_tolerance).toBe(tolerance)
    }
    expect(resistor.resistance).toBe(10000)
    expect(any_circuit_element.parse(resistor)).toEqual(resistor)
  }

  expect(
    source_simple_resistor.safeParse({ ...base, display_tolerance: 0.05 })
      .success,
  ).toBe(false)
})

test("any_circuit_element includes display_tolerance for simple resistors", () => {
  const parsed = any_circuit_element.parse({
    ...base,
    display_tolerance: "1%",
  })

  expect(parsed).toMatchObject({
    ftype: "simple_resistor",
    display_tolerance: "1%",
  })
})
