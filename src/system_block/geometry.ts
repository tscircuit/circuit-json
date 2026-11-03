import { z } from "zod"

/** Resolved diagram coordinates in mm, page-centered with +X right and +Y up. */
export const system_block_point = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
})

export const system_block_id = z.string().trim().min(1)
