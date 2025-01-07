import { test, expect } from "bun:test"
import { capacitance } from "src/units"

test("Capacitance Precision Tests", () => {
  const testCases = [
    { input: "1uF", expected: 0.000001 },
    { input: "10uF", expected: 0.00001 },
    { input: "100uF", expected: 0.0001 },
    { input: "1pF", expected: 1e-12 },
    { input: "10pF", expected: 1e-11 },
    { input: "0.001F", expected: 0.001 },
    { input: "0.009999999999F", expected: 0.01 },
  ]

  testCases.forEach(({ input, expected }) => {
    test(`should parse and round capacitance for input: ${input}`, () => {
      const result = capacitance.parse(input)
      expect(result).toBeCloseTo(expected, 12)
    })
  })
})
