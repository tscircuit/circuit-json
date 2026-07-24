import { test, expect } from "bun:test"
import { pcb_packing_failure } from "../src/pcb/pcb_packing_failure"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_packing_failure parses", () => {
  const failure = pcb_packing_failure.parse({
    type: "pcb_packing_failure",
    message: "Unable to pack all components within the board bounds",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
  })

  expect(failure.pcb_packing_failure_id).toBeDefined()
  expect(failure.pcb_packing_failure_id.startsWith("pcb_packing_failure")).toBe(
    true,
  )
  expect(failure.error_type).toBe("pcb_packing_failure")
  expect(failure.pcb_group_id).toBe("pcb_group_1")
  expect(failure.subcircuit_id).toBe("subcircuit_1")
})

test("any_circuit_element includes pcb_packing_failure", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_packing_failure",
    message: "Unable to pack all components within the board bounds",
  })

  expect(parsed.type).toBe("pcb_packing_failure")
  if (parsed.type === "pcb_packing_failure") {
    expect(parsed.error_type).toBe("pcb_packing_failure")
    expect(parsed.pcb_packing_failure_id).toBeDefined()
  }
})
