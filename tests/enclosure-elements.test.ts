import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_fdm_enclosure,
  source_assembly_device,
  source_cutout_aperture,
  source_fdm_enclosure,
} from "src"

test("parses source assembly and FDM enclosure elements", () => {
  const assembly = source_assembly_device.parse({
    type: "source_assembly_device",
    source_assembly_device_id: "assembly_1",
    name: "controller",
  })
  const enclosure = source_fdm_enclosure.parse({
    type: "source_fdm_enclosure",
    source_fdm_enclosure_id: "enclosure_1",
    source_assembly_device_id: assembly.source_assembly_device_id,
    source_board_id: "source_board_1",
    name: "EN1",
    width: "44mm",
    height: "34mm",
    depth: "16mm",
    wall_thickness: "2mm",
    standoff_height: "4mm",
    auto_cutouts: true,
  })

  expect(enclosure).toEqual({
    type: "source_fdm_enclosure",
    source_fdm_enclosure_id: "enclosure_1",
    source_assembly_device_id: "assembly_1",
    source_board_id: "source_board_1",
    name: "EN1",
    width: 44,
    height: 34,
    depth: 16,
    wall_thickness: 2,
    standoff_height: 4,
    auto_cutouts: true,
  })
})

test("parses shape-specific source cutout apertures", () => {
  const common = {
    type: "source_cutout_aperture" as const,
    source_component_id: "source_component_1",
  }

  expect(
    source_cutout_aperture.parse({
      ...common,
      source_cutout_aperture_id: "aperture_rect",
      shape: "rect",
      width: "8mm",
      height: "10mm",
    }),
  ).toMatchObject({ shape: "rect", width: 8, height: 10 })

  expect(
    source_cutout_aperture.parse({
      ...common,
      source_cutout_aperture_id: "aperture_pill",
      shape: "pill",
      width: "9.2mm",
      height: "3.3mm",
      margin: "0.2mm",
    }),
  ).toMatchObject({ shape: "pill", width: 9.2, height: 3.3, margin: 0.2 })

  expect(
    source_cutout_aperture.parse({
      ...common,
      source_cutout_aperture_id: "aperture_circle",
      shape: "circle",
      radius: "3.25mm",
    }),
  ).toMatchObject({ shape: "circle", radius: 3.25 })

  expect(() =>
    source_cutout_aperture.parse({
      ...common,
      source_cutout_aperture_id: "aperture_invalid",
      shape: "circle",
    }),
  ).toThrow()
})

test("parses generated FDM enclosure CAD", () => {
  const parsed = cad_fdm_enclosure.parse({
    type: "cad_fdm_enclosure",
    cad_fdm_enclosure_id: "cad_enclosure_base",
    source_fdm_enclosure_id: "enclosure_1",
    name: "base",
    position: { x: "0mm", y: "0mm", z: "0mm" },
    size: { x: "44mm", y: "34mm", z: "12mm" },
    model_jscad: { type: "cube", size: [44, 34, 12] },
  })

  expect(parsed.position).toEqual({ x: 0, y: 0, z: 0 })
  expect(parsed.size).toEqual({ x: 44, y: 34, z: 12 })
  expect(parsed.model_jscad).toEqual({ type: "cube", size: [44, 34, 12] })
})

test("all enclosure and assembly elements are accepted by any_circuit_element", () => {
  const elements = [
    {
      type: "source_assembly_device",
      source_assembly_device_id: "assembly_1",
    },
    {
      type: "source_fdm_enclosure",
      source_fdm_enclosure_id: "enclosure_1",
      source_assembly_device_id: "assembly_1",
      source_board_id: "source_board_1",
      wall_thickness: 2,
    },
    {
      type: "source_cutout_aperture",
      source_cutout_aperture_id: "aperture_1",
      source_component_id: "source_component_1",
      shape: "circle",
      radius: 3.25,
    },
    {
      type: "cad_fdm_enclosure",
      cad_fdm_enclosure_id: "cad_enclosure_1",
      source_fdm_enclosure_id: "enclosure_1",
      position: { x: 0, y: 0, z: 0 },
    },
  ]

  for (const element of elements) {
    expect(any_circuit_element.safeParse(element).success).toBe(true)
  }
})
