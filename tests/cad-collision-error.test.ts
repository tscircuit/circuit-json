import { expect, test } from "bun:test"
import { any_circuit_element, cad_collision_error } from "../src"

test("CAD collision errors preserve references and an explicit mm² metric", () => {
  const collisionError = cad_collision_error.parse({
    type: "cad_collision_error",
    message: "USB1 is obstructed",
    is_fatal: false,
    cad_component_id: "cad_component_usb",
    enclosure_cad_component_ids: ["cad_component_base", "cad_component_lid"],
    pcb_component_id: "pcb_component_usb",
    source_component_id: "source_component_usb",
    face: "y_pos",
    intersection_area_mm2: 3.5,
    threshold_area_mm2: 2,
  })
  expect(any_circuit_element.parse(collisionError)).toEqual(collisionError)
  expect(collisionError.error_type).toBe(collisionError.type)
  expect(collisionError.is_fatal).toBe(false)
  expect(collisionError.cad_collision_error_id).toStartWith(collisionError.type)
  for (const invalid of [
    { intersection_area_mm2: -1 },
    { intersection_area_mm2: Infinity },
    { threshold_area_mm2: NaN },
    { enclosure_cad_component_ids: [] },
    { face: "front" },
  ]) {
    expect(
      cad_collision_error.safeParse({
        ...collisionError,
        ...invalid,
      }).success,
    ).toBe(false)
  }
})
