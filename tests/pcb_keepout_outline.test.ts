import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { pcb_keepout_outline } from "src/pcb/pcb_keepout"

test("parses a PCB keepout outline", () => {
  const pcbKeepout = pcb_keepout_outline.parse({
    type: "pcb_keepout",
    shape: "outline",
    pcb_keepout_id: "pcb_keepout_board_edge",
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 20 },
    ],
    stroke_width: "0.2mm",
    layers: ["all"],
  })

  expect(pcbKeepout).toEqual({
    type: "pcb_keepout",
    shape: "outline",
    pcb_keepout_id: "pcb_keepout_board_edge",
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 20 },
    ],
    stroke_width: 0.2,
    layers: ["all"],
  })
  expect(any_circuit_element.parse(pcbKeepout)).toEqual(pcbKeepout)
})
