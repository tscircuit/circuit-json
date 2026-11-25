import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"

test("incomplete assembly checks retain geometry references without explosion stages", () => {
  const warning = {
    type: "cad_assembly_collision_check_warning",
    message: "Could not check the tray geometry",
    cad_component_ids: ["cad_component_tray"],
    pcb_board_ids: ["pcb_board_0"],
    reason: "invalid_geometry",
  }
  const parsed = any_circuit_element.parse(warning)
  expect(parsed).toMatchObject({ ...warning, error_type: warning.type })
  expect(parsed).toHaveProperty("cad_assembly_collision_check_warning_id")
  expect(
    any_circuit_element.safeParse({ ...warning, reason: "clear" }).success,
  ).toBe(false)
})
