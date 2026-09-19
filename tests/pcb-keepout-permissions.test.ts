import { expect, test } from "bun:test"
import { any_circuit_element, type PCBKeepoutInput } from "src"

const base = {
  type: "pcb_keepout" as const,
  pcb_keepout_id: "keepout_1",
  layers: ["top"],
}

test("keepout permissions preserve booleans and omission across all shapes", () => {
  const keepouts = [
    { ...base, shape: "rect", center: { x: 0, y: 0 }, width: 6, height: 6 },
    { ...base, shape: "circle", center: { x: 0, y: 0 }, radius: 3 },
    {
      ...base,
      shape: "outline",
      outline: [
        { x: 0, y: 0 },
        { x: 6, y: 0 },
      ],
      stroke_width: 0.2,
    },
  ] satisfies PCBKeepoutInput[]
  for (const keepout of keepouts) {
    for (const field of ["allow_traces", "allow_placements"] as const) {
      expect(any_circuit_element.parse(keepout)).not.toHaveProperty(field)
      for (const value of [true, false]) {
        const input = { ...keepout, [field]: value }
        expect(any_circuit_element.parse(input)).toHaveProperty(field, value)
      }
      for (const value of ["true", 1, null]) {
        expect(
          any_circuit_element.safeParse({ ...keepout, [field]: value }).success,
        ).toBe(false)
      }
    }
    const combined = {
      ...keepout,
      allow_traces: true,
      allow_placements: true,
      warning_only: true,
    }
    expect(any_circuit_element.parse(combined)).toMatchObject(combined)
  }
})
