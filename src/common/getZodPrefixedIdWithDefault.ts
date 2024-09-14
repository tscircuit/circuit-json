import { z } from "zod"
import { nanoid } from "nanoid"

/**
 * Use this for primary keys for any circuit element
 */
export const getZodPrefixedIdWithDefault = (prefix: string) => {
  return z
    .string()
    .optional()
    .default(() => `${prefix}_${nanoid(10)}`)
}
