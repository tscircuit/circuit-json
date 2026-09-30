import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_enclosure_aperture_intersection_warning,
} from "../src"

test("CAD enclosure warnings preserve references and an explicit mm² metric", () => {
  const warning = cad_enclosure_aperture_intersection_warning.parse({
    type: "cad_enclosure_aperture_intersection_warning",
    message: "USB1 is obstructed",
    cad_component_id: "cad_component_usb",
    enclosure_cad_component_ids: ["cad_component_base", "cad_component_lid"],
    pcb_component_id: "pcb_component_usb",
    source_component_id: "source_component_usb",
    face: "y_pos",
    intersection_area_mm2: 3.5,
    threshold_area_mm2: 2,
  })
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(warning.warning_type).toBe(warning.type)
  expect(warning.cad_enclosure_aperture_intersection_warning_id).toStartWith(
    warning.type,
  )
  for (const invalid of [
    { intersection_area_mm2: -1 },
    { intersection_area_mm2: Infinity },
    { threshold_area_mm2: NaN },
    { enclosure_cad_component_ids: [] },
    { face: "front" },
  ]) {
    expect(
      cad_enclosure_aperture_intersection_warning.safeParse({
        ...warning,
        ...invalid,
      }).success,
    ).toBe(false)
  }
})
