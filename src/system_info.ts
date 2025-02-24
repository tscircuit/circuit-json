import { z } from "zod"

export const system_info = z.object({
  system_name: z.string(),
  version: z.string(),
  author: z.string(),
  timestamp: z.string(),
})

export type SystemInfo = z.infer<typeof system_info>
