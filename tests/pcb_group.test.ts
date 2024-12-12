import { describe, expect, it } from "bun:test"
import { pcb_group } from "../src/pcb/pcb_group"

describe("pcb_group", () => {
  it("should parse valid pcb group", () => {
    const result = pcb_group.parse({
      type: "pcb_group",
      pcb_group_id: "test_group",
      center: { x: 0, y: 0 },
      width: "10mm",
      height: "20mm",
      member_pcb_component_ids: ["comp1", "comp2"],
    })
    expect(result.type).toBe("pcb_group")
    expect(result.width).toBe(10)
    expect(result.height).toBe(20)
    expect(result.center).toEqual({ x: 0, y: 0 })
    expect(result.member_pcb_component_ids).toEqual(["comp1", "comp2"])
  })

  it("should require all mandatory fields", () => {
    expect(() =>
      pcb_group.parse({
        type: "pcb_group",
        pcb_group_id: "test_group",
        // missing center
        width: "10mm",
        height: "20mm",
        member_pcb_component_ids: [],
      }),
    ).toThrow()
  })
})
