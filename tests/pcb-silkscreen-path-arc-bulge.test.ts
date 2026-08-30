import { expect, test } from "bun:test"
import { pcb_silkscreen_path } from "../src/pcb/pcb_silkscreen_path"

test("preserves circular arc bulges on PCB silkscreen paths", () => {
  const path = pcb_silkscreen_path.parse({
    type: "pcb_silkscreen_path",
    pcb_silkscreen_path_id: "pcb_silkscreen_path_arc",
    pcb_component_id: "pcb_component_1",
    layer: "top",
    route: [
      { x: 0, y: 0, bulge: -1 },
      { x: 4, y: 0 },
    ],
    stroke_width: 0.15,
  })

  expect(path.route[0]?.bulge).toBe(-1)
})
