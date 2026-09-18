import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_keepout,
  pcb_keepout_outline,
  type PCBKeepoutInput,
} from "src"

const keepouts = [
  {
    type: "pcb_keepout",
    shape: "rect",
    pcb_keepout_id: "keepout_rect",
    center: { x: 0, y: 0 },
    width: "10mm",
    height: "5mm",
    layers: ["top"],
  },
  {
    type: "pcb_keepout",
    shape: "circle",
    pcb_keepout_id: "keepout_circle",
    center: { x: 0, y: 0 },
    radius: "5mm",
    layers: ["bottom"],
  },
  {
    type: "pcb_keepout",
    shape: "outline",
    pcb_keepout_id: "keepout_outline",
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    stroke_width: "0.2mm",
    layers: ["top", "bottom"],
  },
] satisfies PCBKeepoutInput[]

for (const keepout of keepouts) {
  test(`${keepout.shape} keepout preserves advisory and enforcing values through both parsers`, () => {
    for (const warning_only of [true, false]) {
      const input: PCBKeepoutInput = {
        ...keepout,
        warning_only,
        excluded_pcb_component_ids: ["pcb_component_ant1"],
      }
      const parsed = pcb_keepout.parse(input)
      expect(parsed.warning_only).toBe(warning_only)
      expect(parsed.excluded_pcb_component_ids).toEqual(["pcb_component_ant1"])
      expect(any_circuit_element.parse(input)).toEqual(parsed)
      expect(
        any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
      ).toEqual(parsed)
      if (input.shape === "outline" && parsed.shape === "outline") {
        expect(pcb_keepout_outline.parse(input)).toEqual(parsed)
      }
    }
  })

  test(`${keepout.shape} keepout leaves warning_only absent on existing input`, () => {
    const parsed = pcb_keepout.parse(keepout)
    expect(parsed.warning_only).toBeUndefined()
    expect(Object.hasOwn(parsed, "warning_only")).toBe(false)
    expect(any_circuit_element.parse(keepout)).toEqual(parsed)
  })

  test(`${keepout.shape} keepout rejects non-boolean advisory values`, () => {
    for (const warning_only of ["true", "false", 0, 1, null]) {
      const input = { ...keepout, warning_only }
      expect(pcb_keepout.safeParse(input).success).toBe(false)
      expect(any_circuit_element.safeParse(input).success).toBe(false)
    }
  })
}
