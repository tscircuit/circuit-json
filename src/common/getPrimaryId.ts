import { getZodPrefixedIdWithDefault } from "./getZodPrefixedIdWithDefault"

/**
 * Returns the primary id for any element.
 * Automatically typechecked to ensure proper handling of new elements.
 */
export const getPrimaryId = (prefix: string) => {
  return getZodPrefixedIdWithDefault(prefix)
}
