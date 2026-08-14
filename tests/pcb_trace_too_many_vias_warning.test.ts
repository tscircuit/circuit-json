import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_trace_too_many_vias_warning } from "../src/pcb/pcb_trace_too_many_vias_warning"

const warningInput = {
  type: "pcb_trace_too_many_vias_warning" as const,
  message: "PCB trace has 1 via, exceeding the maximum of 0",
  pcb_trace_id: "pcb_trace_0",
  source_trace_id: "source_trace_0",
  actual_via_count: 1,
  maximum_via_count: 0,
}

test("pcb_trace_too_many_vias_warning parses with a source trace", () => {
  const warning = pcb_trace_too_many_vias_warning.parse(warningInput)

  expect(warning.pcb_trace_too_many_vias_warning_id).toStartWith(
    "pcb_trace_too_many_vias_warning",
  )
  expect(warning.warning_type).toBe("pcb_trace_too_many_vias_warning")
  expect(warning.actual_via_count).toBe(1)
  expect(warning.maximum_via_count).toBe(0)
})

test("pcb_trace_too_many_vias_warning parses with a source net", () => {
  const { source_trace_id: _, ...warningWithoutSourceTrace } = warningInput
  const warning = pcb_trace_too_many_vias_warning.parse({
    ...warningWithoutSourceTrace,
    source_net_id: "source_net_0",
  })

  expect(warning.source_net_id).toBe("source_net_0")
  expect(warning.source_trace_id).toBeUndefined()
})

test("any_circuit_element includes pcb_trace_too_many_vias_warning", () => {
  const parsed = any_circuit_element.parse(warningInput)

  expect(parsed.type).toBe("pcb_trace_too_many_vias_warning")
})
