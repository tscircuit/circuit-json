import { getZodPrefixedIdWithDefault } from "./getZodPrefixedIdWithDefault"

/**
 * Returns a validated primary id for any element.
 */
export const getPrimaryId = (prefix: string): string => {
  const idSchema = getZodPrefixedIdWithDefault(prefix)
  const id = idSchema.parse(`${prefix}_default_id`) // Generate the ID using the prefix

  return id
}
