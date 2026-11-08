import { expect, test } from "bun:test"
import { source_port } from "../src/source/source_port"

test("explicit electrical roles preserve true, false, and unknown", () => {
  const flags = [
    "is_reset_input",
    "is_usb_data_positive",
    "is_usb_data_negative",
    "is_current_sense_positive_input",
    "is_current_sense_negative_input",
    "is_mosfet_gate",
    "is_mosfet_source",
    "is_mosfet_drain",
    "is_transistor_base",
    "is_transistor_collector",
    "is_transistor_emitter",
    "is_diode_anode",
    "is_diode_cathode",
    "is_op_amp_inverting_input",
    "is_op_amp_non_inverting_input",
    "is_op_amp_output",
    "is_relay_coil",
    "is_relay_common_contact",
    "is_relay_normally_open_contact",
    "is_relay_normally_closed_contact",
  ] as const
  const base = {
    type: "source_port",
    name: "RESET",
    source_port_id: "p1",
    port_hints: ["D+", "GATE"],
  }
  const unspecified = source_port.parse(base)
  for (const flag of flags) {
    expect(unspecified[flag]).toBeUndefined()
    for (const value of [true, false]) {
      expect(source_port.parse({ ...base, [flag]: value })[flag]).toBe(value)
    }
    expect(source_port.safeParse({ ...base, [flag]: "true" }).success).toBe(
      false,
    )
  }
})
