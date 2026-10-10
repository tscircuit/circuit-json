import { expect, test } from "bun:test"
import {
  type PCBKeepoutInput,
  any_circuit_element,
  pcb_keepout,
  pcb_keepout_outline,
} from "src"

const keepouts = [
  {
    type: "pcb_keepout",
    shape: "rect",
    pcb_keepout_id: "keepout_rect",
    center: { x: -3, y: 2 },
    width: "4mm",
    height: "2mm",
    layers: ["top"],
  },
  {
    type: "pcb_keepout",
    shape: "circle",
    pcb_keepout_id: "keepout_circle",
    center: { x: -3, y: 2 },
    radius: "2mm",
    layers: ["bottom"],
  },
  {
    type: "pcb_keepout",
    shape: "outline",
    pcb_keepout_id: "keepout_outline",
    outline: [
      { x: -3, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 4 },
    ],
    stroke_width: "0.2mm",
    layers: ["top", "bottom"],
  },
] satisfies PCBKeepoutInput[]

for (const keepout of keepouts) {
  test(`${keepout.shape} keepout preserves ownership without changing permissions or exclusions`, () => {
    const input: PCBKeepoutInput = {
      ...keepout,
      pcb_component_id: "pcb_component_j1",
      excluded_pcb_component_ids: ["pcb_component_other"],
      allow_traces: false,
      allow_placements: false,
      warning_only: false,
    }
    const parsed = pcb_keepout.parse(input)
    expect(parsed.shape).toBe(keepout.shape)
    expect(parsed.pcb_component_id).toBe("pcb_component_j1")
    expect(parsed.excluded_pcb_component_ids).toEqual(["pcb_component_other"])
    expect(parsed.allow_traces).toBe(false)
    expect(parsed.allow_placements).toBe(false)
    expect(parsed.warning_only).toBe(false)
    expect(any_circuit_element.parse(input)).toEqual(parsed)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
    ).toEqual(parsed)
    if (input.shape === "outline" && parsed.shape === "outline") {
      expect(pcb_keepout_outline.parse(input)).toEqual(parsed)
    }

    const ownerOnly = pcb_keepout.parse({
      ...keepout,
      pcb_component_id: "pcb_component_j1",
    })
    expect(ownerOnly).not.toHaveProperty("excluded_pcb_component_ids")
    expect(ownerOnly).not.toHaveProperty("warning_only")
    expect(ownerOnly).not.toHaveProperty("allow_traces")
    expect(ownerOnly).not.toHaveProperty("allow_placements")
  })

  test(`${keepout.shape} unowned keepout remains valid without an inserted owner`, () => {
    const parsed = pcb_keepout.parse(keepout)
    expect(parsed).not.toHaveProperty("pcb_component_id")
    expect(any_circuit_element.parse(keepout)).toEqual(parsed)
    if (keepout.shape === "outline" && parsed.shape === "outline") {
      expect(pcb_keepout_outline.parse(keepout)).toEqual(parsed)
    }
  })

  test(`${keepout.shape} keepout rejects non-string component ownership`, () => {
    for (const pcb_component_id of [null, 1, true, ["pcb_component_j1"], {}]) {
      const input = { ...keepout, pcb_component_id }
      expect(pcb_keepout.safeParse(input).success).toBe(false)
      expect(any_circuit_element.safeParse(input).success).toBe(false)
      if (keepout.shape === "outline") {
        expect(pcb_keepout_outline.safeParse(input).success).toBe(false)
      }
    }
  })
}
