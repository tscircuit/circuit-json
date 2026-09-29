import { expect, test } from "bun:test"
import { any_circuit_element, drc_check_error } from "../src"

test("DRC execution failures survive Circuit JSON parsing and serialization", () => {
  const input = {
    type: "drc_check_error",
    check_name: "routing",
    cause: "Unresolved boundary conflict in boolean operation",
    message:
      "DRC could not complete (routing): Unresolved boundary conflict in boolean operation",
    pcb_board_id: "pcb_board_1",
    subcircuit_id: "subcircuit_1",
    is_fatal: true,
  }
  const error = drc_check_error.parse(input)
  expect(error.drc_check_error_id).toStartWith("drc_check_error_")
  expect(error.error_type).toBe("drc_check_error")
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(error)))).toEqual(
    error,
  )
  expect(
    drc_check_error.safeParse({ ...input, check_name: undefined }).success,
  ).toBe(false)
  expect(
    drc_check_error.safeParse({ ...input, cause: undefined }).success,
  ).toBe(false)
})
