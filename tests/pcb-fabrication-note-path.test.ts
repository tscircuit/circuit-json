import { expect, test } from "bun:test"
import { pcb_fabrication_note_path } from "../src/pcb/pcb_fabrication_note_path"

const basePath = {
  type: "pcb_fabrication_note_path" as const,
  pcb_fabrication_note_path_id: "pcb_fabrication_note_path_0",
  pcb_component_id: "pcb_component_0",
  layer: "top" as const,
  route: [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
  ],
  stroke_width: 1,
}

test("accepts a tooling fabrication path", () => {
  expect(
    pcb_fabrication_note_path.parse({ ...basePath, role: "tooling" }),
  ).toEqual({ ...basePath, role: "tooling" })
})

test("keeps the tooling role optional for existing fabrication paths", () => {
  expect(pcb_fabrication_note_path.parse(basePath)).toEqual(basePath)
})

test("accepts a copper cut fill replacement path", () => {
  const replacementPath = {
    ...basePath,
    role: "copper_cut_fill" as const,
    replaces_pcb_trace_id: "pcb_trace_test_short_0",
  }

  expect(pcb_fabrication_note_path.parse(replacementPath)).toEqual(
    replacementPath,
  )
})

test("requires a replaced trace for copper cut fill paths", () => {
  const result = pcb_fabrication_note_path.safeParse({
    ...basePath,
    role: "copper_cut_fill",
  })

  expect(result.success).toBe(false)
  if (result.success) return

  expect(result.error.issues).toContainEqual(
    expect.objectContaining({
      path: ["replaces_pcb_trace_id"],
      message: "Copper cut fill paths must identify the PCB trace they replace",
    }),
  )
})
