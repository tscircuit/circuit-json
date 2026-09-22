import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_bend,
  type PcbBend,
  type PcbBendInput,
  type PcbCircuitElement,
} from "src"

const input = {
  type: "pcb_bend",
  pcb_board_id: "pcb_board_1",
  name: "B1",
  start: { x: 0, y: "-1cm" },
  end: { x: 0, y: "10mm" },
  bend_angle: "-90deg",
  bend_radius: "0.3cm",
  bend_side: "right",
} satisfies PcbBendInput

test("bend normalizes geometry and signed angle, generates ID, and joins element unions", () => {
  const bend: PcbBend = pcb_bend.parse(input)
  const element: PcbCircuitElement = bend
  expect(bend.pcb_bend_id).toMatch(/^pcb_bend_/)
  expect(bend).toMatchObject({
    start: { x: 0, y: -10 },
    end: { x: 0, y: 10 },
    bend_angle: -90,
    bend_radius: 3,
    bend_side: "right",
  })
  expect(any_circuit_element.parse(element)).toEqual(bend)
  expect(pcb_bend.parse(JSON.parse(JSON.stringify(bend)))).toEqual(bend)
})

test("bend preserves explicit identity and ownership and supports zero/radian angles", () => {
  const bend = pcb_bend.parse({
    ...input,
    pcb_bend_id: "pcb_bend_1",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
    bend_angle: 0,
    bend_side: "left",
  })
  expect(bend).toMatchObject({
    pcb_bend_id: "pcb_bend_1",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
    bend_angle: 0,
    bend_side: "left",
  })
  expect(
    pcb_bend.parse({ ...input, bend_angle: `${Math.PI / 2}rad` }).bend_angle,
  ).toBeCloseTo(90)
})

test("bend requires a board and explicit geometry", () => {
  for (const key of [
    "pcb_board_id",
    "start",
    "end",
    "bend_angle",
    "bend_radius",
    "bend_side",
  ] as const) {
    expect(pcb_bend.safeParse({ ...input, [key]: undefined }).success).toBe(
      false,
    )
  }
  expect(pcb_bend.safeParse({ ...input, bend_side: "top" }).success).toBe(false)
})

test("bend rejects coincident endpoints after normalization and invalid physical values", () => {
  expect(
    pcb_bend.safeParse({ ...input, start: { x: 0, y: "1cm" } }).success,
  ).toBe(false)
  for (const bend_radius of [0, -1, "-1mm", Infinity, NaN]) {
    expect(pcb_bend.safeParse({ ...input, bend_radius }).success).toBe(false)
  }
  for (const value of [Infinity, -Infinity, NaN]) {
    expect(pcb_bend.safeParse({ ...input, bend_angle: value }).success).toBe(
      false,
    )
    for (const endpoint of ["start", "end"] as const) {
      for (const axis of ["x", "y"] as const) {
        expect(
          pcb_bend.safeParse({
            ...input,
            [endpoint]: { ...input[endpoint], [axis]: value },
          }).success,
        ).toBe(false)
      }
    }
  }
})
