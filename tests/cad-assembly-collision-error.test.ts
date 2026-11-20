import { expect, test } from "bun:test"
import { any_circuit_element, cad_assembly_collision_error } from "../src"

const collision = {
  type: "cad_assembly_collision_error",
  message: "Tray screw boss intersects the PCB",
  is_fatal: false,
  cad_component_id: "cad_component_tray",
  pcb_board_id: "pcb_board_0",
  source_component_ids: ["source_component_tray"],
  intersection_volume_mm3: 1.4,
}

test("assembled collisions preserve the part, board and intersection volume", () => {
  const parsed = cad_assembly_collision_error.parse(collision)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    parsed,
  )
  expect(parsed.cad_assembly_collision_error_id).toStartWith(parsed.type)
  expect(parsed.error_type).toBe(parsed.type)
})

test("assembled collisions require a positive intersection volume", () => {
  expect(
    any_circuit_element.safeParse({ ...collision, intersection_volume_mm3: 0 })
      .success,
  ).toBe(false)
})

test("assembled collisions require a finite intersection volume", () => {
  expect(
    any_circuit_element.safeParse({
      ...collision,
      intersection_volume_mm3: Infinity,
    }).success,
  ).toBe(false)
})

test("assembled collisions require a board reference", () => {
  expect(
    any_circuit_element.safeParse({ ...collision, pcb_board_id: "" }).success,
  ).toBe(false)
})
