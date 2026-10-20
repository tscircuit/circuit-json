import { length } from "src/units"
import { z } from "zod"

export const positive_length = length.pipe(z.number().finite().positive())
export const nonnegative_length = length.pipe(z.number().finite().nonnegative())
export const positive_number = z.number().finite().positive()
export const nonnegative_number = z.number().finite().nonnegative()
