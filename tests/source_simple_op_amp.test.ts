import { test, expect } from "bun:test"
import { source_simple_op_amp } from "../src/source/source_simple_op_amp"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_simple_op_amp parses", () => {
  const opamp = source_simple_op_amp.parse({
    type: "source_component",
    ftype: "simple_op_amp",
    source_component_id: "opamp1",
    name: "U1",
  })
  expect(opamp.ftype).toBe("simple_op_amp")
})

test("any_circuit_element includes source_simple_op_amp", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_op_amp",
    source_component_id: "opamp1",
    name: "U1",
  })
  if ("ftype" in parsed) {
    expect(parsed.ftype).toBe("simple_op_amp")
  } else {
    throw new Error("Parsed element missing ftype")
  }
})
