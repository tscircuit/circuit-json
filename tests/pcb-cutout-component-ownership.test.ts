import { expect, test } from "bun:test"
import { pcb_cutout } from "src/pcb/pcb_cutout"

const ownedCutouts = [
  {
    type: "pcb_cutout" as const,
    shape: "rect" as const,
    center: { x: 0, y: 0 },
    width: 8.6,
    height: 17.26,
  },
  {
    type: "pcb_cutout" as const,
    shape: "circle" as const,
    center: { x: 0, y: 0 },
    radius: 2,
  },
  {
    type: "pcb_cutout" as const,
    shape: "polygon" as const,
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 2 },
    ],
  },
  {
    type: "pcb_cutout" as const,
    shape: "path" as const,
    route: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
    ],
    slot_width: 1,
  },
]

test("pcb cutout shapes preserve their owning component id", () => {
  for (const cutout of ownedCutouts) {
    const parsedCutout = pcb_cutout.parse({
      ...cutout,
      pcb_component_id: "pcb_component_1",
    })

    expect(parsedCutout.pcb_component_id).toBe("pcb_component_1")
  }
})

test("pcb cutout ownership remains optional", () => {
  const cutout = pcb_cutout.parse(ownedCutouts[0])

  expect(cutout.pcb_component_id).toBeUndefined()
})
