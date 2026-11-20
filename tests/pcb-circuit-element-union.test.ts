import { expect, test } from "bun:test"
import {
  pcb_courtyard_overlap_error,
  pcb_fabrication_note_path,
  pcb_fabrication_note_text,
  pcb_group,
  pcb_keepout,
  type PcbCircuitElement,
} from "../src/pcb"

test("PCB groups, keepouts, fabrication notes, and courtyard errors belong to PcbCircuitElement", () => {
  const elements: PcbCircuitElement[] = [
    pcb_group.parse({
      type: "pcb_group",
      source_group_id: "source_group_1",
      center: { x: 0, y: 0 },
      pcb_component_ids: [],
    }),
    pcb_keepout.parse({
      type: "pcb_keepout",
      pcb_keepout_id: "pcb_keepout_rect",
      shape: "rect",
      center: { x: 0, y: 0 },
      width: 4,
      height: 2,
      layers: ["top"],
    }),
    pcb_keepout.parse({
      type: "pcb_keepout",
      pcb_keepout_id: "pcb_keepout_circle",
      shape: "circle",
      center: { x: 0, y: 0 },
      radius: 2,
      layers: ["top"],
    }),
    pcb_keepout.parse({
      type: "pcb_keepout",
      pcb_keepout_id: "pcb_keepout_outline",
      shape: "outline",
      outline: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
      stroke_width: 0.2,
      layers: ["top"],
    }),
    pcb_fabrication_note_path.parse({
      type: "pcb_fabrication_note_path",
      pcb_component_id: "pcb_component_1",
      layer: "top",
      route: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
      stroke_width: 0.1,
    }),
    pcb_fabrication_note_text.parse({
      type: "pcb_fabrication_note_text",
      pcb_component_id: "pcb_component_1",
      layer: "top",
      text: "Assembly note",
    }),
    pcb_courtyard_overlap_error.parse({
      type: "pcb_courtyard_overlap_error",
      message: "Component courtyards overlap",
      pcb_component_ids: ["pcb_component_1", "pcb_component_2"],
    }),
  ]

  expect(elements.map((element) => element.type)).toEqual([
    "pcb_group",
    "pcb_keepout",
    "pcb_keepout",
    "pcb_keepout",
    "pcb_fabrication_note_path",
    "pcb_fabrication_note_text",
    "pcb_courtyard_overlap_error",
  ])
})
