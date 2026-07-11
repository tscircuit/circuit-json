import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_trace_too_long_warning } from "../src/pcb/pcb_trace_too_long_warning"

const warningInput = {
  type: "pcb_trace_too_long_warning" as const,
  message: "PCB trace is 12.5mm long, exceeding the 10mm maximum",
  pcb_trace_id: "pcb_trace_0",
  source_trace_id: "source_trace_0",
  actual_trace_length: 12.5,
  maximum_trace_length: 10,
}

test("pcb_trace_too_long_warning parses with a source trace", () => {
  const warning = pcb_trace_too_long_warning.parse(warningInput)

  expect(warning.pcb_trace_too_long_warning_id).toStartWith(
    "pcb_trace_too_long_warning",
  )
  expect(warning.warning_type).toBe("pcb_trace_too_long_warning")
  expect(warning.actual_trace_length).toBe(12.5)
  expect(warning.maximum_trace_length).toBe(10)
})

test("pcb_trace_too_long_warning parses with a source net", () => {
  const { source_trace_id: _, ...warningWithoutSourceTrace } = warningInput
  const warning = pcb_trace_too_long_warning.parse({
    ...warningWithoutSourceTrace,
    source_net_id: "source_net_0",
  })

  expect(warning.source_net_id).toBe("source_net_0")
  expect(warning.source_trace_id).toBeUndefined()
})

test("any_circuit_element includes pcb_trace_too_long_warning", () => {
  const parsed = any_circuit_element.parse(warningInput)

  expect(parsed.type).toBe("pcb_trace_too_long_warning")
})
