import { expect, test } from "bun:test"
import { any_circuit_element, source_runtime_error } from "../src"

test("runtime failures serialize message and phase_name", () => {
  const input = {
    type: "source_runtime_error",
    phase_name: "PcbDesignRuleChecks",
    message:
      "DRC could not complete (routing): Unresolved boundary conflict in boolean operation",
  }
  const error = source_runtime_error.parse(input)
  expect(error.source_runtime_error_id).toStartWith("source_runtime_error_")
  expect(error).toEqual({
    ...input,
    source_runtime_error_id: error.source_runtime_error_id,
    error_type: "source_runtime_error",
  })
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(error)))).toEqual(
    error,
  )
  expect(
    source_runtime_error.safeParse({ ...input, phase_name: undefined }).success,
  ).toBe(false)
  expect(
    source_runtime_error.safeParse({ ...input, message: undefined }).success,
  ).toBe(false)
})
