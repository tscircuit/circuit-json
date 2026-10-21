import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("pcb_stackup rejects nonfinite and out-of-range physical values", () => {
  const minimal = {
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    layers: [{ layer_type: "soldermask" }],
  }
  const invalidPositive = [0, -1, Number.NaN, Number.POSITIVE_INFINITY]
  const invalidNonnegative = [-1, Number.NaN, Number.POSITIVE_INFINITY]

  for (const { layer, positive, nonnegative } of [
    {
      layer: { layer_type: "soldermask" },
      positive: ["thickness", "relative_permittivity"],
      nonnegative: [],
    },
    {
      layer: { layer_type: "copper", layer: "top", thickness: 0.035 },
      positive: ["thickness", "electrical_conductivity_s_per_m"],
      nonnegative: ["rms_surface_roughness"],
    },
    {
      layer: { layer_type: "dielectric", thickness: 1 },
      positive: [
        "thickness",
        "relative_permittivity",
        "dielectric_properties_frequency_hz",
      ],
      nonnegative: ["loss_tangent"],
    },
  ]) {
    for (const field of [...positive, ...nonnegative]) {
      const input = { ...minimal, layers: [{ ...layer, [field]: 1 }] }
      expect(pcb_stackup.safeParse(input).success).toBe(true)
      const invalid = positive.includes(field)
        ? invalidPositive
        : invalidNonnegative
      if (!positive.includes(field)) {
        expect(
          pcb_stackup.safeParse({
            ...minimal,
            layers: [{ ...layer, [field]: 0 }],
          }).success,
        ).toBe(true)
      }
      for (const value of [
        ...invalid,
        ...(field === "thickness" ? ["-0.035mm"] : []),
      ]) {
        expect(
          pcb_stackup.safeParse({
            ...minimal,
            layers: [{ ...layer, [field]: value }],
          }).success,
        ).toBe(false)
      }
    }
  }

  for (const value of [...invalidPositive, "-0.035mm"]) {
    expect(
      pcb_stackup.safeParse({
        ...minimal,
        plated_hole_copper_thickness: value,
      }).success,
    ).toBe(false)
  }
})
