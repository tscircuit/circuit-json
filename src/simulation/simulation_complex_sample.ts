import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_complex_sample = z.object({
  re: z.number(),
  im: z.number(),
})

export interface SimulationComplexSample {
  re: number
  im: number
}

expectTypesMatch<
  SimulationComplexSample,
  z.infer<typeof simulation_complex_sample>
>(true)
