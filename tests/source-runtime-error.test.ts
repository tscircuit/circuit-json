import { expect, test } from "bun:test"
import { any_circuit_element, source_runtime_error } from "../src"

test("Runtime failures survive Circuit JSON parsing and serialization", () => {
  const input = {
    type: "source_runtime_error",
    phase: "PcbDesignRuleChecks",
    check_name: "routing",
    cause: "Unresolved boundary conflict in boolean operation",
    message:
      "DRC could not complete (routing): Unresolved boundary conflict in boolean operation",
    pcb_board_id: "pcb_board_1",
    subcircuit_id: "subcircuit_1",
    is_fatal: true,
  }
  const error = source_runtime_error.parse(input)
  expect(error.source_runtime_error_id).toStartWith("source_runtime_error_")
  expect(error.error_type).toBe("source_runtime_error")
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(error)))).toEqual(
    error,
  )
  expect(
    source_runtime_error.safeParse({ ...input, check_name: undefined }).success,
  ).toBe(true)
  expect(
    source_runtime_error.safeParse({ ...input, cause: undefined }).success,
  ).toBe(false)
})

test("runtime failures do not require DRC-specific context", () => {
  expect(
    source_runtime_error.parse({
      type: "source_runtime_error",
      message: "Rendering failed",
      cause: "Unexpected value",
    }).check_name,
  ).toBeUndefined()
})
