import { test, expect } from "bun:test"
import { capacitance } from "src/units"

test("Capacitance leaves strings untouched but rounds numbers", () => {
  const stringInputs = ["1uF", "0.009999999999999F"]
  for (const input of stringInputs) {
    expect(capacitance.parse(input)).toBe(input)
  }

  const numberCases = [
    { input: 0.001, expected: 0.001 },
    { input: 0.009999999999999, expected: 0.01 },
  ]
  for (const { input, expected } of numberCases) {
    expect(capacitance.parse(input)).toBe(expected)
  }
})
