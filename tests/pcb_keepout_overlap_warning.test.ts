import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_keepout_overlap_warning,
  type PcbCircuitElement,
  type PcbKeepoutOverlapWarningInput,
} from "src"

const input = {
  type: "pcb_keepout_overlap_warning",
  message: "Copper overlaps advisory keepout ANT1",
  pcb_keepout_id: "pcb_keepout_ant1",
} satisfies PcbKeepoutOverlapWarningInput

test("keepout warnings generate IDs and warning_type and belong to circuit element unions", () => {
  const warning: PcbCircuitElement = pcb_keepout_overlap_warning.parse(input)
  expect(warning.pcb_keepout_overlap_warning_id).toStartWith(
    "pcb_keepout_overlap_warning",
  )
  expect(warning.warning_type).toBe("pcb_keepout_overlap_warning")
  expect(warning.pcb_keepout_id).toBe(input.pcb_keepout_id)
  expect(any_circuit_element.parse(warning)).toEqual(warning)
})

test("keepout warnings preserve explicit IDs and related geometry on round-trip", () => {
  const warningInput = {
    ...input,
    pcb_keepout_overlap_warning_id: "pcb_keepout_overlap_warning_1",
    warning_type: "pcb_keepout_overlap_warning",
    pcb_component_ids: ["pcb_component_1"],
    pcb_trace_ids: ["pcb_trace_1"],
    pcb_smtpad_ids: ["pcb_smtpad_1"],
    pcb_plated_hole_ids: ["pcb_plated_hole_1"],
    pcb_via_ids: ["pcb_via_1"],
    center: { x: "2mm", y: "3mm" },
    subcircuit_id: "subcircuit_1",
  } satisfies PcbKeepoutOverlapWarningInput
  const warning = pcb_keepout_overlap_warning.parse(warningInput)
  expect(warning).toEqual({ ...warningInput, center: { x: 2, y: 3 } })
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(warning))),
  ).toEqual(warning)
})

test("keepout warnings require the keepout and message and validate diagnostic fields", () => {
  for (const invalid of [
    { ...input, pcb_keepout_id: undefined },
    { ...input, message: undefined },
    { ...input, warning_type: "pcb_trace_warning" },
    { ...input, pcb_trace_ids: [42] },
  ]) {
    expect(pcb_keepout_overlap_warning.safeParse(invalid).success).toBe(false)
    expect(any_circuit_element.safeParse(invalid).success).toBe(false)
  }
})
