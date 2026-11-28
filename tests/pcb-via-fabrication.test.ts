import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_via, type PcbViaInput } from "../src/pcb/pcb_via"

const baseVia = {
  type: "pcb_via",
  pcb_via_id: "pcb_via_1",
  x: 1,
  y: 2,
  layers: ["top", "bottom"],
} satisfies PcbViaInput

test("pcb_via fabrication fields round-trip through the circuit element parser", () => {
  const input = {
    ...baseVia,
    ipc_4761_via_type_top: "plugged_and_covered",
    ipc_4761_via_type_bottom: "tented",
    drill_method: "mechanical",
    hole_diameter_tolerance: { plus: "0.03mm", minus: 0.02 },
    backdrill: {
      from_side: "bottom",
      must_not_cut_layer: { name: "inner1" },
      max_stub_length: "0.15mm",
      hole_diameter: "0.45mm",
    },
  } satisfies PcbViaInput

  const via = any_circuit_element.parse(input)
  expect(via).toMatchObject({
    ...input,
    hole_diameter_tolerance: { plus: 0.03, minus: 0.02 },
    backdrill: {
      from_side: "bottom",
      must_not_cut_layer: "inner1",
      max_stub_length: 0.15,
      hole_diameter: 0.45,
    },
  })
  expect(via).toEqual(pcb_via.parse(JSON.parse(JSON.stringify(via))))
})

test("pcb_via leaves omitted fabrication fields absent", () => {
  const via = pcb_via.parse(baseVia)
  for (const field of [
    "ipc_4761_via_type_top",
    "ipc_4761_via_type_bottom",
    "drill_method",
    "hole_diameter_tolerance",
    "backdrill",
  ]) {
    expect(via).not.toHaveProperty(field)
  }

  const { backdrill } = pcb_via.parse({
    ...baseVia,
    backdrill: { from_side: "top", must_not_cut_layer: "inner1" },
  })
  expect(backdrill).toEqual({ from_side: "top", must_not_cut_layer: "inner1" })
})

test("pcb_via rejects protection with explicit false tenting on the same side", () => {
  for (const side of ["top", "bottom"] as const) {
    const protectionField = `ipc_4761_via_type_${side}`
    const result = pcb_via.safeParse({
      ...baseVia,
      [protectionField]: "plugged",
      [`tented_on_${side}`]: false,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path)).toEqual([
      [protectionField],
    ])
  }
})

test("pcb_via retains false tenting on an unprotected side", () => {
  const via = pcb_via.parse({
    ...baseVia,
    is_tented: false,
    ipc_4761_via_type_top: "tented",
  })
  expect(via).not.toHaveProperty("tented_on_top")
  expect(via.tented_on_bottom).toBe(false)
  expect(pcb_via.parse(via)).toEqual(via)

  expect(
    pcb_via.parse({
      ...baseVia,
      tented_on_top: true,
      tented_on_bottom: false,
      ipc_4761_via_type_top: "tented",
    }),
  ).toMatchObject({ tented_on_top: true, tented_on_bottom: false })
})

test("pcb_via rejects negative hole tolerance allowances", () => {
  expect(
    pcb_via.safeParse({
      ...baseVia,
      hole_diameter_tolerance: { plus: 0, minus: -0.01 },
    }).success,
  ).toBe(false)
})
