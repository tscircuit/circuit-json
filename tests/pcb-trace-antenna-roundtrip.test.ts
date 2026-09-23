import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"

test("antenna markers survive the public Circuit JSON parser and JSON roundtrip", () => {
  for (const is_antenna_trace of [true, false]) {
    const trace = { type: "pcb_trace", route: [], is_antenna_trace }
    const parsedPcbTrace = any_circuit_element.parse(trace)
    expect(parsedPcbTrace).toHaveProperty("is_antenna_trace", is_antenna_trace)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(parsedPcbTrace))),
    ).toEqual(parsedPcbTrace)
  }
})
