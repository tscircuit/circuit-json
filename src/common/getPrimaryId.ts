import { getZodPrefixedIdWithDefault } from "./getZodPrefixedIdWithDefault"

/**
 * Returns a validated primary id for any element.
 */
export const getPrimaryId = (prefix: string): string => {
  const idSchema = getZodPrefixedIdWithDefault(prefix)
  const id = idSchema.parse(undefined) // Generate the ID

  return id
}
