import { test, expect } from "bun:test"
import { any_source_component } from "src/source/any_source_component"
import { source_simple_ammeter } from "src/source/source_simple_ammeter"

test("source_simple_ammeter", () => {
  const ammeter = source_simple_ammeter.parse({
    type: "source_component",
    ftype: "simple_ammeter",
    source_component_id: "source_ammeter_1",
    name: "AM1",
  })

  expect(ammeter.type).toBe("source_component")
  expect(ammeter.ftype).toBe("simple_ammeter")
  expect(ammeter.source_component_id).toBe("source_ammeter_1")
  expect(ammeter.name).toBe("AM1")
})

test("any_source_component parses source_simple_ammeter", () => {
  const parsed = any_source_component.parse({
    type: "source_component",
    ftype: "simple_ammeter",
    source_component_id: "source_ammeter_1",
    name: "AM1",
  })

  if ("ftype" in parsed && parsed.ftype === "simple_ammeter") {
    expect(parsed.ftype).toBe("simple_ammeter")
    expect(parsed.source_component_id).toBe("source_ammeter_1")
  } else {
    throw new Error("Parsed element is not a source_simple_ammeter")
  }
})
