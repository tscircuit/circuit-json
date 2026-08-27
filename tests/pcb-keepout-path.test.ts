import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_keepout } from "../src/pcb/pcb_keepout"

test("parses a path-shaped PCB keepout", () => {
  const input = {
    type: "pcb_keepout" as const,
    shape: "path" as const,
    pcb_keepout_id: "pcb_keepout_board_edge",
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 20 },
    ],
    stroke_width: "0.2mm",
    layers: ["all"],
  }

  const keepout = pcb_keepout.parse(input)
  const circuitElement = any_circuit_element.parse(input)
  if (
    circuitElement.type !== "pcb_keepout" ||
    circuitElement.shape !== "path"
  ) {
    throw new Error("Expected a path-shaped PCB keepout")
  }

  const expectedKeepout = {
    ...input,
    stroke_width: 0.2,
  }
  expect(keepout).toEqual(expectedKeepout)
  expect(circuitElement).toEqual(expectedKeepout)
})
