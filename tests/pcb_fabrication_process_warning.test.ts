import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"

const osmFinePitchWarningInput = {
  type: "pcb_fabrication_process_warning",
  warning_type: "pcb_fabrication_process_warning",
  message:
    "U1 uses a 0.5 mm land array that needs laser microvias or via-in-pad review",
  pcb_component_id: "pcb_component_1",
  source_component_id: "source_component_1",
  pcb_board_id: "pcb_board_1",
  land_pitch: 0.5,
  required_process: "laser_microvia_or_via_in_pad",
  manufacturer: "jlcpcb",
  reference_url: "https://jlcpcb.com/blog/effective-escape-routing-strategies",
}

test("any_circuit_element represents a fine-pitch fabrication-process warning", () => {
  const warning = any_circuit_element.parse(osmFinePitchWarningInput)

  expect(warning.type).toBe("pcb_fabrication_process_warning")
  if (warning.type !== "pcb_fabrication_process_warning") return

  expect(warning.pcb_fabrication_process_warning_id).toStartWith(
    "pcb_fabrication_process_warning",
  )
  expect(warning.land_pitch).toBe(0.5)
  expect(warning.required_process).toBe("laser_microvia_or_via_in_pad")
  expect(warning.manufacturer).toBe("jlcpcb")
})
