import { z } from "zod"

/** Final complete positive and negative lane lengths, measured in planar mm. */
export interface DifferentialPairLaneLengths {
  positive_length: number
  negative_length: number
}

export const differential_pair_lane_lengths = z.object({
  positive_length: z.number().nonnegative().finite(),
  negative_length: z.number().nonnegative().finite(),
})
