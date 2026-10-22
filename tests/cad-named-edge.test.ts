import { expect, test } from "bun:test"
import "bun-match-svg"
import { any_circuit_element, cad_named_edge } from "../src"

test("named CAD segments preserve stable model associations and finite world points", async () => {
  const width = cad_named_edge.parse({
    type: "cad_named_edge",
    cad_named_edge_id: "edge_width",
    cad_component_id: "cad_rectangular_tube",
    name: " overall_width ",
    start: { x: -20, y: -12.5, z: 0 },
    end: { x: 20, y: -12.5, z: 0 },
  })
  expect(width.name).toBe("overall_width")
  expect(any_circuit_element.parse(width)).toEqual(width)
  for (const field of ["cad_named_edge_id", "cad_component_id", "name"])
    for (const invalid of [undefined, "", "   "])
      expect(
        cad_named_edge.safeParse({ ...width, [field]: invalid }).success,
      ).toBe(false)
  for (const axis of ["x", "y", "z"] as const)
    for (const invalid of [NaN, Infinity, -Infinity])
      expect(
        cad_named_edge.safeParse({
          ...width,
          start: { ...width.start, [axis]: invalid },
        }).success,
      ).toBe(false)
  expect(cad_named_edge.safeParse({ ...width, end: width.start }).success).toBe(
    false,
  )
  const translated = cad_named_edge.parse({
    ...width,
    start: { x: 80, y: -12.5, z: 30 },
    end: { x: 120, y: -12.5, z: 30 },
  })
  expect(translated.name).toBe(width.name)
  expect(translated.end.x - translated.start.x).toBe(40)
  // Contract illustration of a real 40 × 25 × 2 mm rectangular tube section.
  // The drawing exporter tests projection and dimension-line rendering separately.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 160 105"><rect width="160" height="105" fill="white"/><rect x="3" y="3" width="154" height="99" fill="none" stroke="black" stroke-width="0.3"/><text x="10" y="13" font-size="4">RECTANGULAR TUBE — 40 × 25 × 2 mm</text><g transform="translate(40 28) scale(2)"><path d="M 0 0 H 40 V 25 H 0 Z M 2 2 V 23 H 38 V 2 Z" fill="#eee" fill-rule="evenodd" stroke="black" stroke-width="0.3"/><path d="M 0 25 H 40" stroke="#0072b2" stroke-width="0.8"/><circle cx="0" cy="25" r="0.7" fill="#0072b2"/><circle cx="40" cy="25" r="0.7" fill="#0072b2"/></g><text x="80" y="88" font-size="3.5" text-anchor="middle">${width.name} — stable analytic segment, 40 mm</text><text x="10" y="97" font-size="2.8">CAD world mm (+Z up); no mesh topology indices</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
