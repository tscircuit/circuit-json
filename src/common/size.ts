import { z } from "zod"

export const size = z.object({
  width: z.number(),
  height: z.number(),
})

export type Size = z.infer<typeof size>
