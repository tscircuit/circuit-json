import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_explosion_move,
  cad_explosion_stage,
  type CircuitJson,
} from "../src"

const stage = {
  type: "cad_explosion_stage" as const,
  cad_explosion_stage_id: "stage_1",
  name: "device.remove_cover",
  order: 0,
  cad_component_ids: ["cover", "window"],
}
const move = {
  type: "cad_explosion_move" as const,
  cad_explosion_move_id: "move_1",
  cad_explosion_stage_id: "stage_2",
  order: 0,
  targets: [
    { type: "cad_explosion_stage" as const, cad_explosion_stage_id: "stage_1" },
  ],
  translation: { x: 10, y: -2, z: 15 },
}

test("stages and whole-stage movements survive the Circuit JSON union and JSON round trip", () => {
  const circuit: CircuitJson = [stage, move]
  expect(
    JSON.parse(JSON.stringify(circuit)).map((record: unknown) =>
      any_circuit_element.parse(record),
    ),
  ).toEqual(circuit)
  expect(
    cad_explosion_move.parse({
      ...move,
      translation: { x: "1cm", y: "-2mm", z: "15mm" },
    }),
  ).toEqual(move)
  expect(
    cad_explosion_move.parse({
      ...move,
      targets: [
        { type: "cad_component", cad_component_id: "bolt" },
        ...move.targets,
      ],
    }).targets,
  ).toHaveLength(2)
})

test("invalid explosion record shapes and non-finite displacements are rejected", () => {
  for (const patch of [
    { order: -1 },
    { order: 0.5 },
    { cad_explosion_stage_id: "" },
    { cad_component_ids: [""] },
  ])
    expect(cad_explosion_stage.safeParse({ ...stage, ...patch }).success).toBe(
      false,
    )
  for (const patch of [
    { targets: [] },
    { order: -1 },
    { cad_explosion_move_id: "" },
    { targets: [{ type: "cad_explosion_stage", cad_component_id: "wrong" }] },
    { targets: [{ type: "cad_component", cad_component_id: "" }] },
    { translation: { x: Infinity, y: 0, z: 0 } },
    { translation: { x: NaN, y: 0, z: 0 } },
  ])
    expect(cad_explosion_move.safeParse({ ...move, ...patch }).success).toBe(
      false,
    )
})
