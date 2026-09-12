import { expect, test } from "bun:test"
import {
  any_circuit_element,
  fabricator_extra_charge_warning,
  type FabricatorExtraChargeWarningInput,
  type PcbCircuitElement,
} from "../src"

const warningInput = {
  type: "fabricator_extra_charge_warning",
  message:
    "Via hole diameter 0.25 mm is below 0.3 mm and incurs an extra charge",
  fabricator_preset: "jlcpcb_economy",
  pcb_board_id: "pcb_board_0",
  pcb_via_ids: ["pcb_via_0", "pcb_via_1"],
  subcircuit_id: "subcircuit_0",
} satisfies FabricatorExtraChargeWarningInput

test("fabricator extra charge warnings preserve JLCPCB presets and via references", () => {
  for (const fabricator_preset of [
    "jlcpcb_economy",
    "jlcpcb_standard",
    "jlcpcb_economy_20260912",
    "jlcpcb_standard_20260912",
  ]) {
    const parsed: PcbCircuitElement = fabricator_extra_charge_warning.parse({
      ...warningInput,
      fabricator_preset,
    })
    expect(parsed.fabricator_extra_charge_warning_id).toStartWith(
      "fabricator_extra_charge_warning",
    )
    expect(parsed.warning_type).toBe("fabricator_extra_charge_warning")
    expect(parsed.fabricator_preset).toBe(fabricator_preset)
    expect(parsed.pcb_via_ids).toEqual(warningInput.pcb_via_ids)
    expect(parsed.pcb_board_id).toBe(warningInput.pcb_board_id)
    expect(parsed.subcircuit_id).toBe(warningInput.subcircuit_id)
  }
})

test("any_circuit_element includes fabricator_extra_charge_warning", () => {
  const parsed = any_circuit_element.parse({
    ...warningInput,
    fabricator_extra_charge_warning_id: "fabricator_extra_charge_warning_0",
  })
  expect(parsed).toEqual({
    ...warningInput,
    fabricator_extra_charge_warning_id: "fabricator_extra_charge_warning_0",
    warning_type: "fabricator_extra_charge_warning",
  })
})

test("fabricator extra charge warnings allow omitted location references", () => {
  const parsed = fabricator_extra_charge_warning.parse({
    type: warningInput.type,
    message: warningInput.message,
    fabricator_preset: warningInput.fabricator_preset,
  })
  expect(parsed.pcb_via_ids).toBeUndefined()
  expect(parsed.pcb_board_id).toBeUndefined()
  expect(parsed.subcircuit_id).toBeUndefined()
})

test("fabricator extra charge warnings reject missing context and invalid references", () => {
  for (const invalid of [
    { ...warningInput, message: undefined },
    { ...warningInput, fabricator_preset: undefined },
    { ...warningInput, pcb_via_ids: "pcb_via_0" },
    { ...warningInput, warning_type: "pcb_trace_warning" },
  ]) {
    expect(fabricator_extra_charge_warning.safeParse(invalid).success).toBe(
      false,
    )
  }
})
