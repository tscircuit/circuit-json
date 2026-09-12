import { expect, test } from "bun:test"
import { any_circuit_element, pcb_via, type PcbViaInput } from "../src"

const viaInput = {
  type: "pcb_via",
  pcb_via_id: "pcb_via_1",
  x: 1,
  y: 2,
  outer_diameter: 0.6,
  hole_diameter: 0.3,
  layers: ["top", "bottom"],
  source_net_id: "source_net_1",
} satisfies PcbViaInput

test("omitted via tenting does not introduce mask defaults", () => {
  expect(pcb_via.parse(viaInput)).toEqual(viaInput)
  expect(any_circuit_element.parse(viaInput)).toEqual(viaInput)
})

test("legacy both-face tenting booleans remain unchanged", () => {
  for (const is_tented of [true, false]) {
    const input = { ...viaInput, is_tented } satisfies PcbViaInput
    expect(pcb_via.parse(input)).toEqual(input)
    expect(any_circuit_element.parse(input)).toEqual(input)
  }
})

test("per-side via tenting preserves every top and bottom combination", () => {
  for (const is_tented_top of [true, false]) {
    for (const is_tented_bottom of [true, false]) {
      const input = {
        ...viaInput,
        is_tented_top,
        is_tented_bottom,
      } satisfies PcbViaInput
      expect(pcb_via.parse(input)).toEqual(input)
      expect(any_circuit_element.parse(input)).toEqual(input)
    }
  }
})

test("specifying one face leaves the other face unspecified", () => {
  for (const field of ["is_tented_top", "is_tented_bottom"] as const) {
    for (const value of [true, false]) {
      const input = { ...viaInput, [field]: value } satisfies PcbViaInput
      expect(pcb_via.parse(input)).toEqual(input)
      expect(any_circuit_element.parse(input)).toEqual(input)
    }
  }
})

test("per-side overrides are retained alongside the legacy fallback", () => {
  for (const is_tented of [true, false]) {
    for (const field of ["is_tented_top", "is_tented_bottom"] as const) {
      const input = {
        ...viaInput,
        is_tented,
        [field]: !is_tented,
      } satisfies PcbViaInput
      expect(pcb_via.parse(input)).toEqual(input)
      expect(any_circuit_element.parse(input)).toEqual(input)
    }
  }
})

test("via tenting fields reject nonboolean values", () => {
  for (const field of [
    "is_tented",
    "is_tented_top",
    "is_tented_bottom",
  ] as const) {
    for (const value of [null, 0, 1, "true", "false", "both", {}, []]) {
      const input = { ...viaInput, [field]: value }
      expect(pcb_via.safeParse(input).success).toBe(false)
      expect(any_circuit_element.safeParse(input).success).toBe(false)
    }
  }
})
