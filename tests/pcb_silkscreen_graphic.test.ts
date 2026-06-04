import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_silkscreen_graphic } from "../src/pcb/pcb_silkscreen_graphic"

test("pcb_silkscreen_graphic brep parses", () => {
  const graphic = pcb_silkscreen_graphic.parse({
    type: "pcb_silkscreen_graphic",
    pcb_component_id: "pcb_component_0",
    shape: "brep",
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0, bulge: 0.25 },
          { x: 2, y: 0 },
          { x: 2, y: 2 },
          { x: 0, y: 2 },
        ],
      },
    },
    layer: "top",
  })

  expect(graphic.shape).toBe("brep")
  expect(graphic.brep_shape.outer_ring.vertices.length).toBe(4)
  expect(graphic.brep_shape.inner_rings).toEqual([])
  expect((graphic as any).pcb_silkscreen_graphic_id).toBeDefined()
  expect(any_circuit_element.parse(graphic)).toBeDefined()
})

test("pcb_silkscreen_graphic accepts optional image_asset", () => {
  const graphic = pcb_silkscreen_graphic.parse({
    type: "pcb_silkscreen_graphic",
    pcb_component_id: "pcb_component_0",
    shape: "brep",
    brep_shape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ],
      },
    },
    layer: "bottom",
    image_asset: {
      project_relative_path: "assets/logo.png",
      url: "https://example.com/logo.png",
      mimetype: "image/png",
    },
  })

  expect(graphic.image_asset).toEqual({
    project_relative_path: "assets/logo.png",
    url: "https://example.com/logo.png",
    mimetype: "image/png",
  })
  expect(any_circuit_element.parse(graphic)).toBeDefined()
})
