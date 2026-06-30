import { test, expect } from "bun:test"
import { source_unnamed_trace_warning } from "../src/source/source_unnamed_trace_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_unnamed_trace_warning parses", () => {
  const warning = source_unnamed_trace_warning.parse({
    type: "source_unnamed_trace_warning",
    message: "Trace is missing a name",
    source_trace_id: "source_trace_0",
  })

  expect(warning.source_unnamed_trace_warning_id).toBeDefined()
  expect(
    warning.source_unnamed_trace_warning_id.startsWith(
      "source_unnamed_trace_warning",
    ),
  ).toBe(true)
  expect(warning.warning_type).toBe("source_unnamed_trace_warning")
})

test("any_circuit_element includes source_unnamed_trace_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_unnamed_trace_warning",
    message: "Trace is missing a name",
    source_trace_id: "source_trace_0",
  })

  expect(parsed.type).toBe("source_unnamed_trace_warning")
})
