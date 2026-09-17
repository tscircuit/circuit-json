import { expect, test } from "bun:test"
import { pcb_via, type PcbVia, type PcbViaInput } from "../src/pcb/pcb_via"
import { any_circuit_element } from "../src/any_circuit_element"

const baseVia = {
  type: "pcb_via",
  x: 1,
  y: 2,
  layers: ["top", "bottom"],
} satisfies PcbViaInput

for (const schema of [pcb_via, any_circuit_element]) {
  const schemaName = schema === pcb_via ? "pcb_via" : "any_circuit_element"

  test(`${schemaName} preserves optional drill layers and through-hole status`, () => {
    for (const top of [undefined, "top", "inner1"] as const) {
      for (const bottom of [undefined, "inner2", "bottom"] as const) {
        for (const throughHole of [undefined, false, true]) {
          const input = {
            ...baseVia,
            ...(top !== undefined && { topmost_drill_layer: top }),
            ...(bottom !== undefined && { bottommost_drill_layer: bottom }),
            ...(throughHole !== undefined && { through_hole: throughHole }),
          } satisfies PcbViaInput
          const via = schema.parse(input) as PcbVia

          for (const field of [
            "topmost_drill_layer",
            "bottommost_drill_layer",
            "through_hole",
          ] as const) {
            if (input[field] === undefined) {
              expect(via).not.toHaveProperty(field)
            } else {
              expect(via[field]).toBe(input[field])
            }
          }
          expect(schema.parse(via)).toEqual(via)
        }
      }
    }
  })

  test(`${schemaName} normalizes drill layer references`, () => {
    const via = schema.parse({
      ...baseVia,
      topmost_drill_layer: { name: "inner1" },
      bottommost_drill_layer: { name: "inner8" },
    }) as PcbVia

    expect(via.topmost_drill_layer).toBe("inner1")
    expect(via.bottommost_drill_layer).toBe("inner8")
  })

  test(`${schemaName} rejects invalid drill layers and through-hole status`, () => {
    for (const field of ["topmost_drill_layer", "bottommost_drill_layer"]) {
      for (const value of ["inner9", "invalid", 1, null]) {
        expect(schema.safeParse({ ...baseVia, [field]: value }).success).toBe(
          false,
        )
      }
    }
    for (const value of ["true", 1, null]) {
      expect(
        schema.safeParse({ ...baseVia, through_hole: value }).success,
      ).toBe(false)
    }
  })

  test(`${schema === pcb_via ? "pcb_via" : "any_circuit_element"} migrates legacy tenting and preserves per-side overrides`, () => {
    for (const legacy of [undefined, false, true]) {
      for (const top of [undefined, false, true]) {
        for (const bottom of [undefined, false, true]) {
          const via = schema.parse({
            ...baseVia,
            ...(legacy !== undefined && { is_tented: legacy }),
            ...(top !== undefined && { tented_on_top: top }),
            ...(bottom !== undefined && { tented_on_bottom: bottom }),
          }) as PcbVia

          expect({
            top: via.tented_on_top,
            bottom: via.tented_on_bottom,
          }).toEqual({ top: top ?? legacy, bottom: bottom ?? legacy })
          expect(via).not.toHaveProperty("is_tented")
          expect(schema.parse(via)).toEqual(via)
        }
      }
    }
  })
}

test("pcb_via leaves omitted tenting fields absent", () => {
  const via = pcb_via.parse(baseVia)
  expect(via).not.toHaveProperty("tented_on_top")
  expect(via).not.toHaveProperty("tented_on_bottom")
})

test("pcb_via rejects non-boolean tenting fields", () => {
  for (const field of ["is_tented", "tented_on_top", "tented_on_bottom"]) {
    for (const value of ["true", 1, null]) {
      expect(pcb_via.safeParse({ ...baseVia, [field]: value }).success).toBe(
        false,
      )
    }
  }
})

test("pcb_via allows source and subcircuit connectivity references", () => {
  const via = pcb_via.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "foo",
    source_trace_id: "source_trace_1",
    source_net_id: "source_net_1",
  })

  expect(via.subcircuit_connectivity_map_key).toBe("foo")
  expect(via.source_trace_id).toBe("source_trace_1")
  expect(via.source_net_id).toBe("source_net_1")
})

test("any_circuit_element includes pcb_via connectivity references", () => {
  const via = any_circuit_element.parse({
    type: "pcb_via",
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    subcircuit_connectivity_map_key: "bar",
    source_trace_id: "source_trace_2",
    source_net_id: "source_net_2",
  }) as PcbVia

  expect(via.subcircuit_connectivity_map_key).toBe("bar")
  expect(via.source_trace_id).toBe("source_trace_2")
  expect(via.source_net_id).toBe("source_net_2")
})

test("pcb_via rejects an empty source net id", () => {
  expect(() =>
    pcb_via.parse({
      type: "pcb_via",
      x: 1,
      y: 2,
      layers: ["top", "bottom"],
      source_net_id: "",
    }),
  ).toThrow()
})
