import { expect, test } from "bun:test"
import { capacitance } from "src/units"

test("Capacitance Precision Tests", () => {
  const testCases = [
    { input: "1uF", expected: 0.000001 },
    { input: "10uF", expected: 0.00001 },
    { input: "100uF", expected: 0.0001 },
    { input: "1pF", expected: 1e-12 },
    { input: "10pF", expected: 1e-11 },
    { input: "0.001F", expected: 0.001 },
    { input: "0.009999999999999F", expected: 0.01 },
    { input: "0.1pF", expected: 1e-13 },
    { input: "0.01pF", expected: 1e-14 },
    { input: "0.001pF", expected: 1e-15 },
  ]

  const results = testCases.map((testCase) => ({
    ...testCase,
    actual: capacitance.parse(testCase.input),
  }))

  expect(
    `${"Input".padEnd(20)} ${"Actual".padEnd(16)} ${"Expected".padEnd(16)}\n${results
      .map(
        (r) =>
          `${r.input.padEnd(20)} ${r.actual.toString().padEnd(16)} ${r.expected.toString().padEnd(16)}`,
      )
      .join("\n")}`,
  ).toMatchInlineSnapshot(`
"Input                Actual           Expected        
1uF                  0.000001         0.000001        
10uF                 0.00001          0.00001         
100uF                0.0001           0.0001          
1pF                  1e-12            1e-12           
10pF                 1e-11            1e-11           
0.001F               0.001            0.001           
0.009999999999999F   0.01             0.01            
0.1pF                1e-13            1e-13           
0.01pF               1e-14            1e-14           
0.001pF              1e-15            1e-15           "
`)

  expect(results.every((r) => r.actual === r.expected)).toBeTrue()
})
