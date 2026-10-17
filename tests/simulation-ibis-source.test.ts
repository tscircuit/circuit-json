import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { model } from "./fixtures/simulation-ibis"

test("IBIS sources are exclusive and remote sources require byte hashes", () => {
  for (const source of [
    { url: "https://example.com/chip.ibs" },
    { file: "chip.ibs", content: "[IBIS Ver] 4.2" },
    { ...model.source, sha256: "invalid" },
    { ...model.source, archive: { member: "" } },
  ]) {
    expect(any_circuit_element.safeParse({ ...model, source }).success).toBe(
      false,
    )
  }
  expect(
    any_circuit_element.safeParse({ ...model, source: { file: "chip.ibs" } })
      .success,
  ).toBe(true)
  expect(
    any_circuit_element.safeParse({ ...model, pin_to_source_port_map: {} })
      .success,
  ).toBe(false)
  expect(
    any_circuit_element.safeParse({ ...model, corner: undefined }).success,
  ).toBe(false)
})
