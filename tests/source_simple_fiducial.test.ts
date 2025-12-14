import { test, expect } from "bun:test"
import { source_simple_fiducial } from "../src/source/source_simple_fiducial"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_simple_fiducial parses", () => {
  const fiducial = source_simple_fiducial.parse({
    type: "source_component",
    ftype: "simple_fiducial",
    source_component_id: "fiducial1",
    name: "F1",
  })
  expect(fiducial.ftype).toBe("simple_fiducial")
})

test("any_circuit_element includes source_simple_fiducial", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_fiducial",
    source_component_id: "fiducial1",
    name: "F1",
  })
  if ("ftype" in parsed && parsed.ftype === "simple_fiducial") {
    expect(parsed.ftype).toBe("simple_fiducial")
  } else {
    throw new Error("Parsed element not a source_simple_fiducial")
  }
})
