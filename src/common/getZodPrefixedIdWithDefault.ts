import { z } from "zod"

// Generates a random string ID of specified length using alphanumeric characters
const randomId = (length: number): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("")
}
/**
 * Use this for primary keys for any circuit element
 */
export const getZodPrefixedIdWithDefault = (prefix: string) => {
  return z
    .string()
    .optional()
    .default(() => `${prefix}_${randomId(10)}`)
}
