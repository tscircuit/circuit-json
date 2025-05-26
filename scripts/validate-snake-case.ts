import { any_circuit_element } from "../src/any_circuit_element"
import { z } from "zod"

interface ValidationError {
  path: string
  message: string
}

// Snake case regex
const SNAKE_CASE_REGEX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/

// Common property names that are allowed to be camelCase
const ALLOWED_CAMELCASE = new Set([
  // Common Zod methods
  "parse",
  "safeParse",
  "parseAsync",
  "safeParseAsync",
  "refine",
  "superRefine",
  "transform",
  "default",
  "optional",
  "nullable",
  "nullish",
  "array",
  "promise",

  // Common property names
  "defaultValue",
  "minLength",
  "maxLength",
  "minValue",
  "maxValue",
  "pattern",
  "errorMap",
  "description",
  "brand",
  "catch",
  "pipe",
  "readonly",
  "unwrap",
  "element",
  "items",
  "nonempty",
  "length",
  "min",
  "max",
  "multipleOf",
  "int",
  "positive",
  "nonnegative",
  "negative",
  "nonpositive",
  "email",
  "url",
  "uuid",
  "cuid",
  "cuid2",
  "ulid",
  "datetime",
  "date",
  "time",
  "duration",
  "ip",
  "ipv4",
  "ipv6",
  "emoji",
  "trim",
  "toLowerCase",
  "toUpperCase",
  "noDefault",
  "getDefault",
  "superRefine",
  "refinement",
  "check",
  "isValid",
  "isValidAsync",
  "safeParseAsync",
  "safeParse",
  "parseAsync",
  "parse",
  "spa",
  "sparse",
  "strict",
  "strip",
])

function validateSchema(
  schema: z.ZodTypeAny,
  path: string = "",
): ValidationError[] {
  const errors: ValidationError[] = []

  // Skip if not an object schema
  if (!("_def" in schema) || !schema._def) {
    return errors
  }

  // Handle different Zod types
  const def = schema._def as any

  // Check object properties
  if (def.typeName === "ZodObject") {
    const shape = def.shape()
    for (const [key, value] of Object.entries(
      shape as Record<string, z.ZodTypeAny>,
    )) {
      const fullPath = path ? `${path}.${key}` : key

      // Skip allowed camelCase properties
      if (
        ALLOWED_CAMELCASE.has(key) ||
        ALLOWED_CAMELCASE.has(key.toLowerCase())
      ) {
        continue
      }

      // Check if property name is in snake_case
      if (!SNAKE_CASE_REGEX.test(key)) {
        errors.push({
          path: fullPath,
          message: `Property "${key}" is not in snake_case`,
        })
      }

      // Recursively check nested schemas
      if (value && typeof value === "object") {
        errors.push(...validateSchema(value, fullPath))
      }
    }
  }
  // Handle arrays
  else if (def.typeName === "ZodArray") {
    errors.push(...validateSchema(def.type, `${path}[]`))
  }
  // Handle unions
  else if (def.typeName === "ZodUnion") {
    for (const option of def.options) {
      errors.push(...validateSchema(option, path))
    }
  }
  // Handle records
  else if (def.typeName === "ZodRecord") {
    errors.push(...validateSchema(def.valueType, `${path}{}`))
  }
  // Handle lazy types (recursive types)
  else if (def.typeName === "ZodLazy") {
    // Skip recursive checks to avoid infinite loops
    return []
  }

  return errors
}

// Main execution
function main() {
  console.log("🔍 Validating property names in circuit element schema...\n")

  // Validate the main schema
  const errors = validateSchema(any_circuit_element)

  if (errors.length > 0) {
    console.error("Validation errors found:")
    errors.forEach((error) => {
      console.error(`✖ ${error.path}: ${error.message}`)
    })
    console.error(
      `\n❌ Found ${errors.length} non-snake_case property name${errors.length === 1 ? "" : "s"}`,
    )
    process.exit(1)
  } else {
    console.log("✅ All property names are in snake_case!")
    process.exit(0)
  }
}

// Run the validation
main()
