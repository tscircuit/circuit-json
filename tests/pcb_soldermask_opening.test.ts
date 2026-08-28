import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { pcb_soldermask_opening } from "src/pcb/pcb_soldermask_opening"

test("parses rectangular and polygonal PCB soldermask openings", () => {
  const rectangularOpening = pcb_soldermask_opening.parse({
    type: "pcb_soldermask_opening",
    shape: "rotated_rect",
    x: 1,
    y: 2,
    width: 3,
    height: 4,
    ccw_rotation: 45,
    layer: "top",
    pcb_component_id: "pcb_component_1",
  })
  const polygonalOpening = pcb_soldermask_opening.parse({
    type: "pcb_soldermask_opening",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
    layer: "bottom",
  })

  expect(rectangularOpening).toMatchObject({
    shape: "rotated_rect",
    ccw_rotation: 45,
    layer: "top",
  })
  expect(polygonalOpening).toMatchObject({
    shape: "polygon",
    layer: "bottom",
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
  })
  expect(any_circuit_element.parse(rectangularOpening)).toEqual(
    rectangularOpening,
  )
  expect(any_circuit_element.parse(polygonalOpening)).toEqual(polygonalOpening)
})
