import { z } from "zod"
import { nanoid } from "nanoid"

/**
 * Returns the primary id for any element.
 * Automatically typechecked to ensure proper handling of new elements.
 */
export const getPrimaryId = (prefix: string): string => {
  const idSchema = z.string().startsWith(prefix)
  const id = `${prefix}_${nanoid()}`

  // Validate the generated ID
  idSchema.parse(id)

  return id
}
