import { z } from "zod"
import { nanoid } from "nanoid"

/**
 * Returns the primary id schema for any element.
 * Automatically typechecked to ensure proper handling of new elements.
 */
export const getPrimaryId = (prefix: string) => {
  return z.string().default(() => `${prefix}_${nanoid()}`)
}
