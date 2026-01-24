import { any_circuit_element } from "../src/any_circuit_element"
import { z } from "zod"

const seen = new Set<z.ZodTypeAny>()
const errors: string[] = []

function checkSnakeCase(name: string, path: string) {
  if (/[A-Z]/.test(name)) {
    errors.push(`Uppercase character found in "${name}" at ${path}`)
  }
}

function traverse(schema: z.ZodTypeAny, path: string) {
  if (seen.has(schema)) return
  seen.add(schema)

  const def = schema._def
  const typeName = def.typeName

  if (typeName === "ZodObject") {
    const shape = def.shape()
    for (const key in shape) {
      checkSnakeCase(key, `${path}.${key}`)
      traverse(shape[key], `${path}.${key}`)
    }
  } else if (typeName === "ZodUnion" || typeName === "ZodDiscriminatedUnion") {
    const options =
      def.options || (def.optionsMap ? Array.from(def.optionsMap.values()) : [])
    options.forEach((opt: any, i: number) => {
      traverse(opt, `${path}[union:${i}]`)
    })
  } else if (typeName === "ZodArray") {
    traverse(def.type, `${path}[]`)
  } else if (
    typeName === "ZodOptional" ||
    typeName === "ZodNullable" ||
    typeName === "ZodBranded"
  ) {
    traverse(def.innerType, path)
  } else if (typeName === "ZodEnum") {
    def.values.forEach((v: string) => {
      checkSnakeCase(v, `${path} (enum value)`)
    })
  } else if (typeName === "ZodRecord") {
    traverse(def.keyType, `${path}[key]`)
    traverse(def.valueType, `${path}[value]`)
  } else if (typeName === "ZodLazy") {
    traverse(def.getter(), path)
  } else if (typeName === "ZodEffects") {
    traverse(def.schema, path)
  } else if (typeName === "ZodPipeline") {
    traverse(def.in, path)
    traverse(def.out, path)
  } else if (typeName === "ZodIntersection") {
    traverse(def.left, path)
    traverse(def.right, path)
  } else if (typeName === "ZodDefault") {
    traverse(def.innerType, path)
  }
}

console.log("Checking any_circuit_element for snake_case properties...")
traverse(any_circuit_element, "any_circuit_element")

if (errors.length > 0) {
  console.error("Snake case errors found:")
  errors.forEach((err) => console.error(`  - ${err}`))
  process.exit(1)
} else {
  console.log("No snake case errors found!")
  process.exit(0)
}
