import { expect, test } from "bun:test"
import {
  type PcbPin1Location,
  getRotationBetweenPcbPin1Locations,
} from "src/pcb/properties/pcb_pin1_location"

const rotationCycles = [
  [
    "leftside_top",
    "bottomside_left",
    "rightside_bottom",
    "topside_right",
  ],
  [
    "leftside_bottom",
    "bottomside_right",
    "rightside_top",
    "topside_left",
  ],
] as const satisfies readonly (readonly PcbPin1Location[])[]

const quarterTurnRotations = [0, 90, 180, 270] as const

test("maps every rotation-compatible pin 1 location pair", () => {
  for (const cycle of rotationCycles) {
    for (let fromIndex = 0; fromIndex < cycle.length; fromIndex++) {
      for (let toIndex = 0; toIndex < cycle.length; toIndex++) {
        const expectedRotation =
          quarterTurnRotations[
            (toIndex - fromIndex + cycle.length) % cycle.length
          ]!

        expect(
          getRotationBetweenPcbPin1Locations(
            cycle[fromIndex]!,
            cycle[toIndex]!,
          ),
        ).toBe(expectedRotation)
      }
    }
  }
})

test("returns null when pin 1 locations differ by reflection", () => {
  for (const from of rotationCycles[0]) {
    for (const to of rotationCycles[1]) {
      expect(getRotationBetweenPcbPin1Locations(from, to)).toBeNull()
      expect(getRotationBetweenPcbPin1Locations(to, from)).toBeNull()
    }
  }
})
