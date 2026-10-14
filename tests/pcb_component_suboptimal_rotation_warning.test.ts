import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_component_suboptimal_rotation_warning,
  type AnyCircuitElement,
  type PcbComponentSuboptimalRotationWarning,
  type PcbComponentSuboptimalRotationWarningInput,
  type PcbCircuitElement,
} from "src"

const warningInput = {
  type: "pcb_component_suboptimal_rotation_warning",
  message: "U1 at 180° has 6 airwire crossings; consider 0° with 0 crossings.",
  pcb_component_id: "pcb_component_1",
  current_rotation: 180,
  recommended_rotation: 0,
  current_crossing_count: 6,
  recommended_crossing_count: 0,
} satisfies PcbComponentSuboptimalRotationWarningInput

test("suboptimal rotation warning supplies defaults and participates in element unions", () => {
  const warning: PcbComponentSuboptimalRotationWarning =
    pcb_component_suboptimal_rotation_warning.parse(warningInput)
  const pcbElement: PcbCircuitElement = warning
  const circuitElement: AnyCircuitElement = pcbElement
  expect(warning.pcb_component_suboptimal_rotation_warning_id).toStartWith(
    "pcb_component_suboptimal_rotation_warning",
  )
  expect(warning.warning_type).toBe("pcb_component_suboptimal_rotation_warning")
  expect(warning.evaluation_method).toBe("airwire_crossings")
  expect(any_circuit_element.parse(circuitElement)).toEqual(warning)
  expect(warning.rotation_candidates).toBeUndefined()
})

test("full warning preserves all four scores, references and a supplied ID", () => {
  const fullInput = {
    ...warningInput,
    pcb_component_suboptimal_rotation_warning_id:
      "pcb_component_suboptimal_rotation_warning_1",
    source_component_id: "source_component_1",
    pcb_board_id: "pcb_board_1",
    subcircuit_id: "subcircuit_1",
    rotation_candidates: [
      { rotation: 0, crossing_count: 0 },
      { rotation: 90, crossing_count: 3 },
      { rotation: 180, crossing_count: 6 },
      { rotation: 270, crossing_count: 3 },
    ],
  } satisfies PcbComponentSuboptimalRotationWarningInput
  const warning = pcb_component_suboptimal_rotation_warning.parse(fullInput)
  expect(any_circuit_element.parse(fullInput)).toEqual(warning)
  expect(warning).toMatchObject(fullInput)
  expect(pcb_component_suboptimal_rotation_warning.parse(warning)).toEqual(
    warning,
  )
})

test("rotations use the canonical degree/radian input parser", () => {
  const warning = pcb_component_suboptimal_rotation_warning.parse({
    ...warningInput,
    current_rotation: "180deg",
    recommended_rotation: `${Math.PI / 2}rad`,
    rotation_candidates: [{ rotation: "-90deg", crossing_count: 0 }],
  })
  expect(warning.current_rotation).toBe(180)
  expect(warning.recommended_rotation).toBeCloseTo(90)
  expect(warning.rotation_candidates).toEqual([
    { rotation: -90, crossing_count: 0 },
  ])
})

test("invalid counts, nonfinite rotations, and unsupported heuristics are rejected", () => {
  for (const crossingCount of [-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    for (const field of [
      "current_crossing_count",
      "recommended_crossing_count",
    ] as const) {
      expect(
        pcb_component_suboptimal_rotation_warning.safeParse({
          ...warningInput,
          [field]: crossingCount,
        }).success,
      ).toBe(false)
    }
    expect(
      pcb_component_suboptimal_rotation_warning.safeParse({
        ...warningInput,
        rotation_candidates: [{ rotation: 90, crossing_count: crossingCount }],
      }).success,
    ).toBe(false)
  }
  for (const invalidRotation of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "NaNdeg",
    "Infinityrad",
  ]) {
    for (const field of ["current_rotation", "recommended_rotation"] as const) {
      expect(
        pcb_component_suboptimal_rotation_warning.safeParse({
          ...warningInput,
          [field]: invalidRotation,
        }).success,
      ).toBe(false)
    }
    expect(
      pcb_component_suboptimal_rotation_warning.safeParse({
        ...warningInput,
        rotation_candidates: [{ rotation: invalidRotation, crossing_count: 0 }],
      }).success,
    ).toBe(false)
  }
  expect(
    pcb_component_suboptimal_rotation_warning.safeParse({
      ...warningInput,
      rotation_candidates: [],
    }).success,
  ).toBe(false)
  expect(
    pcb_component_suboptimal_rotation_warning.safeParse({
      ...warningInput,
      evaluation_method: "routed_trace_crossings",
    }).success,
  ).toBe(false)
  const { pcb_component_id, ...withoutComponent } = warningInput
  expect(
    pcb_component_suboptimal_rotation_warning.safeParse(withoutComponent)
      .success,
  ).toBe(false)
})
