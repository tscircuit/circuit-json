import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_autorouter_warning,
  type AnyCircuitElement,
  type PcbCircuitElement,
  type PcbAutorouterWarning,
  type PcbAutorouterWarningInput,
} from "../src"

const warningInput: PcbAutorouterWarningInput = {
  type: "pcb_autorouter_warning",
  message: "Via placement is blocked; deferring connection to direct routing",
}

test("autorouter warnings can describe a non-fatal condition without a trace", () => {
  const warning: PcbAutorouterWarning =
    pcb_autorouter_warning.parse(warningInput)

  expect(warning.pcb_autorouter_warning_id).toStartWith(
    "pcb_autorouter_warning",
  )
  expect(warning.warning_type).toBe("pcb_autorouter_warning")
  expect(warning.message).toBe(warningInput.message)
  expect(warning.connection_name).toBeUndefined()
  expect(warning.pcb_port_ids).toBeUndefined()
  expect(warning.center).toBeUndefined()
  expect(warning.subcircuit_id).toBeUndefined()
  expect(warning).not.toHaveProperty("error_type")
})

test("autorouter warnings preserve supplied identity and routing context", () => {
  const contextualWarning = {
    ...warningInput,
    pcb_autorouter_warning_id: "pcb_autorouter_warning_4",
    warning_type: "pcb_autorouter_warning" as const,
    connection_name: "source_trace_2",
    pcb_port_ids: ["pcb_port_1", "pcb_port_2"],
    center: { x: 4.5, y: -2 },
    subcircuit_id: "subcircuit_0",
  }
  const warning: PcbCircuitElement =
    pcb_autorouter_warning.parse(contextualWarning)
  const element: AnyCircuitElement =
    any_circuit_element.parse(contextualWarning)

  expect(warning).toEqual(contextualWarning)
  expect(element).toEqual(contextualWarning)
})

test("autorouter warnings reject missing messages and malformed routing context", () => {
  expect(
    pcb_autorouter_warning.safeParse({ type: warningInput.type }).success,
  ).toBe(false)
  expect(
    pcb_autorouter_warning.safeParse({ ...warningInput, pcb_port_ids: [1] })
      .success,
  ).toBe(false)
  expect(
    pcb_autorouter_warning.safeParse({ ...warningInput, center: { x: 0 } })
      .success,
  ).toBe(false)
  expect(
    pcb_autorouter_warning.safeParse({
      ...warningInput,
      warning_type: "pcb_autorouting_error",
    }).success,
  ).toBe(false)
})
