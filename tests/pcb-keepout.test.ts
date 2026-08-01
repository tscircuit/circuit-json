import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { type PCBKeepout, pcb_keepout } from "../src/pcb/pcb_keepout"

test.each([
  {
    type: "pcb_keepout" as const,
    shape: "rect" as const,
    pcb_keepout_id: "keepout_rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 5,
    layers: ["top"],
    excluded_pcb_component_ids: ["pcb_component_ant1"],
  },
  {
    type: "pcb_keepout" as const,
    shape: "circle" as const,
    pcb_keepout_id: "keepout_circle",
    center: { x: 0, y: 0 },
    radius: 5,
    layers: ["top"],
    excluded_pcb_component_ids: ["pcb_component_ant1"],
  },
])("$shape keepout retains excluded PCB component IDs", (input) => {
  const keepout = pcb_keepout.parse(input)
  const circuitElement = any_circuit_element.parse(input) as PCBKeepout

  expect(keepout.excluded_pcb_component_ids).toEqual(["pcb_component_ant1"])
  expect(circuitElement.excluded_pcb_component_ids).toEqual([
    "pcb_component_ant1",
  ])
})
