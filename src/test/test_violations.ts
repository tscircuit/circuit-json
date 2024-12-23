import { z } from "zod"

// This file contains intentional violations for testing the lint script
export const test_camel_case = z.object({
  myProperty: z.string(),  // Should fail: camelCase
  another_prop: z.string() // Should pass: snake_case
})

export const test_enum_case = z.enum([
  "goodCase",      // Should fail: not snake_case
  "snake_case_ok"  // Should pass: snake_case
])
