import { expect, test } from "bun:test"
import { any_circuit_element, cad_enclosure } from "../src"
test("enclosure associations survive a standalone JSON round trip", () => {
  const enclosure = cad_enclosure.parse({
    type: "cad_enclosure",
    cad_component_ids: ["base", "lid"],
    source_component_id: "case",
    is_in_assembly: true,
    apertures: [{ pcb_component_id: "usb", face: "y_pos" }],
  })
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(enclosure))),
  ).toEqual(enclosure)
  for (const invalid of [
    { cad_component_ids: [] },
    { is_in_assembly: undefined },
    { apertures: [{ pcb_component_id: "usb", face: "front" }] },
  ]) {
    expect(cad_enclosure.safeParse({ ...enclosure, ...invalid }).success).toBe(
      false,
    )
  }
})
