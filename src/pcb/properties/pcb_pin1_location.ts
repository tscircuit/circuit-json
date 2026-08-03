import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

/**
 * Describes where pin 1 is located on an unrotated, top-view PCB footprint.
 */
export const pcb_pin1_location = z.enum([
  "leftside_top",
  "leftside_bottom",
  "rightside_top",
  "rightside_bottom",
  "topside_left",
  "topside_right",
  "bottomside_left",
  "bottomside_right",
])

type InferredPcbPin1Location = z.infer<typeof pcb_pin1_location>

export type PcbPin1Location =
  | "leftside_top"
  | "leftside_bottom"
  | "rightside_top"
  | "rightside_bottom"
  | "topside_left"
  | "topside_right"
  | "bottomside_left"
  | "bottomside_right"

expectTypesMatch<PcbPin1Location, InferredPcbPin1Location>(true)

export type PcbPin1LocationRotation = 0 | 90 | 180 | 270

const pin1LocationRotationCycles: readonly (readonly PcbPin1Location[])[] = [
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
]

/**
 * Returns the counter-clockwise rotation that maps one pin 1 location to
 * another, or null when the locations differ by reflection rather than
 * rotation.
 */
export const getRotationBetweenPcbPin1Locations = (
  from: PcbPin1Location,
  to: PcbPin1Location,
): PcbPin1LocationRotation | null => {
  for (const cycle of pin1LocationRotationCycles) {
    const fromIndex = cycle.indexOf(from)
    const toIndex = cycle.indexOf(to)

    if (fromIndex !== -1 && toIndex !== -1) {
      return (((toIndex - fromIndex + cycle.length) % cycle.length) *
        90) as PcbPin1LocationRotation
    }
  }

  return null
}
