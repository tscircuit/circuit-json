import { z } from "zod"

/** Bit rate in bits/s. Strings require bit/s or bps, with optional k or M prefix. */
export const bit_rate = z
  .union([z.number(), z.string()])
  .transform((bitRate, context) => {
    if (typeof bitRate === "number") return bitRate
    const match = /^(\d+(?:\.\d+)?)\s*([kM]?)(?:bit\/s|bps)$/.exec(
      bitRate.trim(),
    )
    if (!match) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bit rate must use bit/s or bps, for example 100kbps",
      })
      return z.NEVER
    }
    const scale = match[2] === "M" ? 1_000_000 : match[2] === "k" ? 1_000 : 1
    return Number(match[1]) * scale
  })
  .pipe(z.number().int().positive().finite())
