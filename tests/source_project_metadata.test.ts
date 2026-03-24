import { expect, test } from "bun:test"
import { source_project_metadata } from "../src/source/source_project_metadata"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_project_metadata parses", () => {
  const metadata = source_project_metadata.parse({
    type: "source_project_metadata",
    name: "My Project",
  })

  expect(metadata.type).toBe("source_project_metadata")
  expect(metadata.name).toBe("My Project")
})

test("any_circuit_element includes source_project_metadata", () => {
  const parsed = any_circuit_element.parse({
    type: "source_project_metadata",
    name: "My Project",
  })
  expect(parsed.type).toBe("source_project_metadata")
  if (parsed.type === "source_project_metadata") {
    expect(parsed.name).toBe("My Project")
  } else {
    throw new Error("Parsed element not a source_project_metadata")
  }
})

test("source_project_metadata parses with all fields set", () => {
  const metadata = source_project_metadata.parse({
    type: "source_project_metadata",
    name: "My Project",
    software_used_string: "tscircuit",
    project_url: "https://example.com",
    created_at: "2024-03-24T18:52:43Z",
    schematic_disabled: true,
  })

  expect(metadata.name).toBe("My Project")
  expect(metadata.software_used_string).toBe("tscircuit")
  expect(metadata.project_url).toBe("https://example.com")
  expect(metadata.created_at).toBe("2024-03-24T18:52:43Z")
  expect(metadata.schematic_disabled).toBe(true)
})

test("source_project_metadata parses with schematic_disabled set to false", () => {
  const metadata = source_project_metadata.parse({
    type: "source_project_metadata",
    name: "My Project",
    schematic_disabled: false,
  })

  expect(metadata.schematic_disabled).toBe(false)
})

test("source_project_metadata fails on invalid created_at timestamp", () => {
  expect(() =>
    source_project_metadata.parse({
      type: "source_project_metadata",
      created_at: "not-a-timestamp",
    }),
  ).toThrow()
})

test("source_project_metadata fails on missing type", () => {
  expect(() =>
    source_project_metadata.parse({
      name: "My Project",
    } as any),
  ).toThrow()
})

test("source_project_metadata fails on incorrect type", () => {
  expect(() =>
    source_project_metadata.parse({
      type: "invalid_type",
    } as any),
  ).toThrow()
})
