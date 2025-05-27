import { any_circuit_element } from "../src/any_circuit_element"
import { z } from "zod"

interface ValidationError {
  path: string
  message: string
}

// Snake case regex
const SNAKE_CASE_REGEX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/

function isZodSchema(value: unknown): value is z.ZodTypeAny {
  return (
    typeof value === "object" &&
    value !== null &&
    "_def" in value &&
    typeof (value as any)._def === "object" &&
    (value as any)._def !== null
  )
}

function getSchemaShape(
  schema: z.ZodTypeAny,
): Record<string, z.ZodTypeAny> | null {
  const def = (schema as any)._def

  // Handle objects
  if (def.typeName === "ZodObject") {
    return def.shape()
  }

  // Handle unions
  if (def.typeName === "ZodUnion") {
    // Combine shapes from all union members
    return def.options.reduce(
      (acc: Record<string, z.ZodTypeAny>, option: z.ZodTypeAny) => {
        const shape = getSchemaShape(option)
        return shape ? { ...acc, ...shape } : acc
      },
      {},
    )
  }

  // Handle arrays
  if (def.typeName === "ZodArray") {
    return getSchemaShape(def.type)
  }

  // Handle records
  if (def.typeName === "ZodRecord") {
    return getSchemaShape(def.valueType)
  }

  // Handle lazy types (recursive schemas)
  if (def.typeName === "ZodLazy") {
    return getSchemaShape(def.getter())
  }

  return null
}

function validateSchema(
  schema: z.ZodTypeAny,
  path: string = "",
  visited: Set<z.ZodTypeAny> = new Set(),
): ValidationError[] {
  const errors: ValidationError[] = []

  if (visited.has(schema)) {
    return errors
  }
  visited.add(schema)

  // Get the shape of the current schema
  const shape = getSchemaShape(schema)
  if (!shape) {
    return errors
  }

  // Check each property in the shape
  for (const [key, value] of Object.entries(shape)) {
    const fullPath = path ? `${path}.${key}` : key

    // Skip numeric keys (array indices)
    if (/^\d+$/.test(key)) {
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
    if (isZodSchema(value)) {
      errors.push(...validateSchema(value, fullPath, visited))
    }
  }

  return errors
}

// Main execution
function main() {
  console.log("🔍 Validating property names in circuit element schema...\n")

  try {
    // Validate the main schema
    const errors = validateSchema(any_circuit_element)

    if (errors.length > 0) {
      console.error("Validation errors found:")
      // Sort errors by path for better readability
      const sortedErrors = [...errors].sort((a, b) =>
        a.path.localeCompare(b.path),
      )

      sortedErrors.forEach((error) => {
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
  } catch (error) {
    console.error("Error during validation:", error)
    process.exit(1)
  }
}

// Run the validation
main()
