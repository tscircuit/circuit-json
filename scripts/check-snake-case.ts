import { z } from "zod"
import { any_circuit_element } from "../src/any_circuit_element"

const seen = new Set<z.core.$ZodType>()
const errors: string[] = []

const SNAKE_CASE_IGNORED_PATH_FRAGMENTS = [
  ".metadata.kicad_symbol",
  ".kicad_footprint_metadata",
  ".metadata.kicad_footprint",
]

function shouldIgnorePath(path: string): boolean {
  return SNAKE_CASE_IGNORED_PATH_FRAGMENTS.some((fragment) =>
    path.includes(fragment),
  )
}

function checkSnakeCase(name: string, path: string) {
  if (shouldIgnorePath(path)) return

  if (/[A-Z]/.test(name)) {
    errors.push(`Uppercase character found in "${name}" at ${path}`)
  }
}

function traverse(schema: z.core.$ZodType, path: string) {
  if (seen.has(schema)) return
  seen.add(schema)

  if (schema instanceof z.ZodObject) {
    for (const key in schema.shape) {
      checkSnakeCase(key, `${path}.${key}`)
      traverse(schema.shape[key], `${path}.${key}`)
    }
  } else if (
    schema instanceof z.ZodUnion ||
    schema instanceof z.ZodDiscriminatedUnion
  ) {
    schema.options.forEach((option, index) => {
      traverse(option, `${path}[union:${index}]`)
    })
  } else if (schema instanceof z.ZodArray) {
    traverse(schema.element, `${path}[]`)
  } else if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault ||
    schema instanceof z.ZodPrefault
  ) {
    traverse(schema.unwrap(), path)
  } else if (schema instanceof z.ZodEnum) {
    for (const value of schema.options) {
      if (typeof value === "string") {
        checkSnakeCase(value, `${path} (enum value)`)
      }
    }
  } else if (schema instanceof z.ZodRecord) {
    traverse(schema.keyType, `${path}[key]`)
    traverse(schema.valueType, `${path}[value]`)
  } else if (schema instanceof z.ZodLazy) {
    traverse(schema.unwrap(), path)
  } else if (schema instanceof z.ZodPipe) {
    traverse(schema.in, path)
    traverse(schema.out, path)
  } else if (schema instanceof z.ZodIntersection) {
    traverse(schema.def.left, path)
    traverse(schema.def.right, path)
  }
}

console.log("Checking any_circuit_element for snake_case properties...")
traverse(any_circuit_element, "any_circuit_element")

if (errors.length > 0) {
  console.error("Snake case errors found:")
  for (const err of errors) {
    console.error(`  - ${err}`)
  }
  process.exit(1)
} else {
  console.log("No snake case errors found!")
  process.exit(0)
}
