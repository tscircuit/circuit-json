import { test, expect } from "bun:test"
import { pcb_packing_error } from "../src/pcb/pcb_packing_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_packing_error parses", () => {
  const error = pcb_packing_error.parse({
    type: "pcb_packing_error",
    message: "Unable to pack all components within the board bounds",
    pcb_group_id: "pcb_group_1",
    subcircuit_id: "subcircuit_1",
  })

  expect(error.pcb_packing_error_id).toBeDefined()
  expect(error.pcb_packing_error_id.startsWith("pcb_packing_error")).toBe(
    true,
  )
  expect(error.error_type).toBe("pcb_packing_error")
  expect(error.pcb_group_id).toBe("pcb_group_1")
  expect(error.subcircuit_id).toBe("subcircuit_1")
})

test("any_circuit_element includes pcb_packing_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_packing_error",
    message: "Unable to pack all components within the board bounds",
  })

  expect(parsed.type).toBe("pcb_packing_error")
  if (parsed.type === "pcb_packing_error") {
    expect(parsed.error_type).toBe("pcb_packing_error")
    expect(parsed.pcb_packing_error_id).toBeDefined()
  }
})
