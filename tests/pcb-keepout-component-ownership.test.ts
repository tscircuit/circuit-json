import { expect, test } from "bun:test"
import { type PCBKeepoutInput, any_circuit_element, pcb_keepout } from "src"

test("keepout component ownership survives parsing for every shape", () => {
  const base = {
    type: "pcb_keepout" as const,
    pcb_keepout_id: "pcb_keepout_1",
    layers: ["top"],
  }
  const keepouts = [
    { ...base, shape: "rect", center: { x: 0, y: 0 }, width: 6, height: 4 },
    { ...base, shape: "circle", center: { x: 0, y: 0 }, radius: 3 },
    {
      ...base,
      shape: "outline",
      outline: [
        { x: 0, y: 0 },
        { x: 6, y: 0 },
      ],
      stroke_width: 0.2,
    },
  ] satisfies PCBKeepoutInput[]

  for (const keepout of keepouts) {
    expect(pcb_keepout.parse(keepout)).not.toHaveProperty("pcb_component_id")
    const ownedKeepout = {
      ...keepout,
      pcb_component_id: "pcb_component_1",
      excluded_pcb_component_ids: ["pcb_component_2"],
    } satisfies PCBKeepoutInput
    expect(pcb_keepout.parse(ownedKeepout)).toMatchObject(ownedKeepout)
    expect(any_circuit_element.parse(ownedKeepout)).toMatchObject(ownedKeepout)

    for (const invalidOwner of [null, 1, []]) {
      expect(
        pcb_keepout.safeParse({ ...keepout, pcb_component_id: invalidOwner })
          .success,
      ).toBe(false)
    }
  }
})
