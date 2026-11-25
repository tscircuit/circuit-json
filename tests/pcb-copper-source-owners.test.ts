import { expect, test } from "bun:test"
import {
  any_circuit_element,
  type PcbTraceInput,
  type PcbViaInput,
} from "../src"

test("component copper source owners survive parsing and JSON roundtrips", () => {
  const bridge = {
    type: "pcb_trace",
    source_component_internal_connection_id:
      "source_component_internal_connection_0",
    route: [],
  } satisfies PcbTraceInput
  const via = {
    type: "pcb_via",
    source_manually_placed_via_id: "source_manually_placed_via_0",
    x: 0,
    y: 0,
    layers: ["top", "bottom"],
  } satisfies PcbViaInput

  for (const copper of [bridge, via]) {
    const parsedCopper = any_circuit_element.parse(copper)
    expect(parsedCopper).toMatchObject(copper)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(parsedCopper))),
    ).toEqual(parsedCopper)
  }
})
