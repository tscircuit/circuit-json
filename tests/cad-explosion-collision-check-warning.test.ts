import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_explosion_collision_check_warning,
} from "../src"

test("incomplete explosion checks retain unsupported geometry and stage references", () => {
  const warning = cad_explosion_collision_check_warning.parse({
    type: "cad_explosion_collision_check_warning",
    message: 'Could not check the external model for "motor"',
    cad_explosion_stage_ids: ["stage_lift"],
    cad_component_ids: ["cad_motor"],
    pcb_board_ids: [],
    reason: "unsupported_geometry",
  })
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(warning.error_type).toBe(warning.type)
  for (const patch of [
    { cad_explosion_stage_ids: [] },
    { cad_component_ids: [""] },
    { pcb_board_ids: [""] },
    { reason: "clear" },
  ])
    expect(
      cad_explosion_collision_check_warning.safeParse({ ...warning, ...patch })
        .success,
    ).toBe(false)
})
