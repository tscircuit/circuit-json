import { expect, test } from "bun:test"
import "bun-match-svg"
import {
  any_circuit_element,
  drawing,
  drawing_view,
  drawing_artifact,
} from "../src"

test("drawing elements preserve sheet/view/artifact intent and validate dimensions", async () => {
  const sheet = drawing.parse({
    type: "drawing",
    drawing_id: "drawing_1",
    name: "Housing",
    width: 180,
    height: 100,
    model_glb_url: "https://example.test/housing.glb",
  })
  const views = [
    drawing_view.parse({
      type: "drawing_view",
      drawing_view_id: "view_1",
      drawing_id: sheet.drawing_id,
      direction: "z_positive",
      center: { x: -40, y: 0 },
      width: 65,
      height: 65,
    }),
    drawing_view.parse({
      type: "drawing_view",
      drawing_view_id: "view_2",
      drawing_id: sheet.drawing_id,
      direction: "x_positive",
      center: { x: 40, y: 0 },
      width: 65,
      height: 65,
      show_hidden_edges: true,
      section: { axis: "x", offset: 5, keep_side: "less", hatch_spacing: 1 },
    }),
  ]
  const artifact = drawing_artifact.parse({
    type: "drawing_artifact",
    drawing_artifact_id: "artifact_1",
    drawing_id: sheet.drawing_id,
    drawing_view_id: "view_1",
    format: "png",
    url: "data:image/png;base64,AA==",
    pixel_width: 260,
    pixel_height: 260,
  })
  for (const record of [sheet, ...views, artifact])
    expect(any_circuit_element.parse(record)).toEqual(record)
  for (const field of ["drawing_id", "width", "height"])
    expect(drawing.safeParse({ ...sheet, [field]: undefined }).success).toBe(
      false,
    )
  for (const patch of [
    { width: 0 },
    { height: -1 },
    { scale: 0 },
    { scale: Infinity },
    { direction: "x-positive" },
    { section: { axis: "x", offset: 0 } },
    { section: { axis: "x", offset: 0, keep_side: "less", hatch_spacing: 0 } },
  ])
    expect(drawing_view.safeParse({ ...views[0], ...patch }).success).toBe(
      false,
    )
  expect(
    drawing_artifact.safeParse({ ...artifact, pixel_width: 1.5 }).success,
  ).toBe(false)
  // A schema-level layout preview: real model rendering is tested by circuit-json-to-drawing.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="400" viewBox="0 0 180 100"><rect width="180" height="100" fill="white"/><rect x="2" y="2" width="176" height="96" fill="none" stroke="black" stroke-width="0.3"/><text x="6" y="10" font-size="4">Housing — schema viewport layout (mm)</text>${views.map((view) => `<g transform="translate(${90 + view.center.x - view.width / 2} ${50 - view.center.y - view.height / 2})"><rect width="${view.width}" height="${view.height}" fill="none" stroke="black" stroke-dasharray="1 1" stroke-width="0.2"/><path d="M ${view.width / 2 - 2} ${view.height / 2} h 4 M ${view.width / 2} ${view.height / 2 - 2} v 4" stroke="black" stroke-width="0.2"/><text x="2" y="6" font-size="3">${view.direction}</text><text x="2" y="${view.height - 3}" font-size="3">${view.section ? "Section x = 5; keep less" : "65 × 65 mm"}</text></g>`).join("")}</svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
