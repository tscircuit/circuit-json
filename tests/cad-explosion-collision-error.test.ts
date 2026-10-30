import { expect, test } from "bun:test"
import { any_circuit_element, cad_explosion_collision_error } from "../src"

test("explosion collisions preserve movement, obstacle and swept-volume references", () => {
  const error = cad_explosion_collision_error.parse({
    type: "cad_explosion_collision_error",
    message: 'Explosion stage "lift" moves "cover" through "bracket"',
    is_fatal: false,
    cad_explosion_stage_id: "stage_lift",
    cad_explosion_move_id: "move_cover",
    moving_cad_component_id: "cad_cover",
    obstacle: { type: "cad_component", cad_component_id: "cad_bracket" },
    source_component_ids: ["source_cover", "source_bracket"],
    swept_intersection_volume_mm3: 0.025,
  })
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(error)))).toEqual(
    error,
  )
  expect(error.cad_explosion_collision_error_id).toStartWith(error.type)
  expect(error.error_type).toBe(error.type)
  expect(
    any_circuit_element.parse({
      ...error,
      obstacle: { type: "pcb_board", pcb_board_id: "board" },
    }),
  ).toMatchObject({ obstacle: { type: "pcb_board", pcb_board_id: "board" } })
  for (const patch of [
    { cad_explosion_stage_id: "" },
    { cad_explosion_move_id: undefined },
    { moving_cad_component_id: "" },
    { obstacle: { type: "pcb_board", cad_component_id: "cad_bracket" } },
    { obstacle: { type: "cad_component", cad_component_id: "" } },
    { source_component_ids: [] },
    { source_component_ids: [""] },
    { swept_intersection_volume_mm3: 0 },
    { swept_intersection_volume_mm3: -1 },
    { swept_intersection_volume_mm3: Infinity },
    { swept_intersection_volume_mm3: NaN },
  ])
    expect(
      cad_explosion_collision_error.safeParse({ ...error, ...patch }).success,
    ).toBe(false)
})
