import { test, expect } from "bun:test"
import { source_pcb_ground_plane } from "src/source/source_pcb_ground_plane"

test("source_pcb_ground_plane schema is defined", () => {
  expect(source_pcb_ground_plane).toBeDefined()
  expect(typeof source_pcb_ground_plane).toBe("object")
})
