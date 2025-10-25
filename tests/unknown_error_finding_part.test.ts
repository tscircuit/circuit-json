import { test, expect } from "bun:test"
import { unknown_error_finding_part } from "../src/source/unknown_error_finding_part"

test("unknown_error_finding_part parses", () => {
  const error = unknown_error_finding_part.parse({
    type: "unknown_error_finding_part",
    message: "Failed to fetch supplier part numbers: Received HTML response",
    source_component_id: "source_component_1",
  })

  expect(error.type).toBe("unknown_error_finding_part")
  expect(error.error_type).toBe("unknown_error_finding_part")
  expect(error.message).toContain("HTML response")
  expect(error.source_component_id).toBe("source_component_1")
  expect(error.unknown_error_finding_part_id).toBeDefined()
  expect(
    error.unknown_error_finding_part_id.startsWith(
      "unknown_error_finding_part",
    ),
  ).toBe(true)
})
