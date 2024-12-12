import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import * as ts from "typescript"
import { promisify } from "util"
import { glob as globCallback } from "glob"

const glob = promisify(globCallback)

// Type mapping from TypeScript/zod to Pydantic
const typeMapping = {
  string: "str",
  number: "float",
  boolean: "bool",
  undefined: "None",
  null: "None",
  any: "Any",
  unknown: "Any",
  object: "dict",
  Array: "list",
} as const

type TypeMapping = typeof typeMapping

// Common field type mappings with explicit type annotations
type FieldType = {
  type: string
  imports?: string[]
}

const fieldTypeMapping: Record<string, FieldType> = {
  x: { type: "float" },
  y: { type: "float" },
  z: { type: "float" },
  width: { type: "float" },
  height: { type: "float" },
  type: { type: "str" },
  id: { type: "str" },
  name: { type: "str" },
  description: { type: "str" },
  route: { type: "List[Point]", imports: ["List", "Point"] },
} as const

// Unit-related types that need special handling
const unitTypes = new Set([
  "resistance",
  "capacitance",
  "inductance",
  "voltage",
  "current",
  "frequency",
  "length",
  "width",
  "height",
  "thickness",
  "radius",
  "diameter",
])

interface TypeInfo {
  type: string
  imports: Set<string>
  needsUnitValidator?: boolean
}

function getFieldType(propertyName: string): TypeInfo | null {
  const fieldType =
    fieldTypeMapping[propertyName as keyof typeof fieldTypeMapping]
  if (fieldType) {
    const imports = new Set<string>(fieldType.imports || [])
    return { type: fieldType.type, imports }
  }
  return null
}

// Convert zod type to Pydantic type
function zodToPydantic(type: ts.Type, checker: ts.TypeChecker): TypeInfo {
  const imports = new Set<string>()

  // Handle enum types
  if (type.isUnion() && type.types.every((t) => t.isLiteral())) {
    const literals = type.types.map((t) => {
      const literal = checker.typeToString(t)
      return literal.startsWith('"') ? literal : `"${literal}"`
    })
    return {
      type: `Literal[${literals.join(", ")}]`,
      imports: new Set(["Literal"]),
      needsUnitValidator: false,
    }
  }

  // Handle arrays
  if (checker.isArrayType(type)) {
    const typeArgs = checker.getTypeArguments(type as ts.TypeReference)
    if (typeArgs.length > 0 && typeArgs[0]) {
      const elementType = typeArgs[0]
      const innerType = zodToPydantic(elementType, checker)
      imports.add("List")
      innerType.imports.forEach((imp) => imports.add(imp))
      return {
        type: `List[${innerType.type}]`,
        imports,
        needsUnitValidator: false,
      }
    }
  }

  // Handle objects/interfaces
  const symbol = type.getSymbol()
  if (symbol) {
    const symbolFlags = symbol.getFlags()
    const isClassOrInterface = !!(
      symbolFlags & ts.SymbolFlags.Class ||
      symbolFlags & ts.SymbolFlags.Interface
    )

    if (isClassOrInterface) {
      const name = symbol.getName()
      imports.add(name)
      return {
        type: name,
        imports,
        needsUnitValidator: false,
      }
    }
  }

  // Handle union types
  if (type.isUnion()) {
    const validTypes = type.types.filter((t): t is ts.Type => !!t)
    const types = validTypes.map((t) => zodToPydantic(t, checker))

    if (types.length === 0) {
      imports.add("Any")
      return {
        type: "Any",
        imports,
        needsUnitValidator: false,
      }
    }

    const uniqueTypes = new Set(types.map((t) => t.type))
    types.forEach((t) => t.imports.forEach((imp) => imports.add(imp)))

    if (uniqueTypes.size === 1 && types[0]) {
      return {
        type: types[0].type,
        imports,
        needsUnitValidator: false,
      }
    }

    imports.add("Union")
    return {
      type: `Union[${Array.from(uniqueTypes).join(", ")}]`,
      imports,
      needsUnitValidator: false,
    }
  }

  // Handle basic types
  const typeString = checker.typeToString(type)
  const basicType = typeMapping[typeString as keyof TypeMapping]
  if (basicType) {
    return {
      type: basicType,
      imports: new Set(),
      needsUnitValidator: false,
    }
  }

  // Default to Any for unknown types
  imports.add("Any")
  return {
    type: "Any",
    imports,
    needsUnitValidator: false,
  }
}

// Generate Pydantic model from TypeScript interface
function generatePydanticModel(
  interfaceName: string,
  type: ts.Type,
  checker: ts.TypeChecker,
): string {
  const imports = new Set<string>()
  const propertyLines: string[] = []
  const validatorLines: string[] = []

  const properties = type.getProperties()
  for (const prop of properties) {
    const declaration = prop.declarations?.[0]
    if (!declaration) continue

    const propType = checker.getTypeAtLocation(declaration)
    const typeInfo = zodToPydantic(propType, checker)
    typeInfo.imports.forEach((imp) => imports.add(imp))

    propertyLines.push(`    ${prop.getName()}: ${typeInfo.type}`)

    // Add validator for unit types
    if (typeInfo.needsUnitValidator) {
      imports.add("validator")
      validatorLines.push(`
    @validator("${prop.getName()}")
    def validate_${prop.getName()}(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        if not isinstance(v, str):
            raise ValueError(f"Expected string or number, got {type(v)}")
        return SIUnitConverter.convert_to_base_unit(v)`)
    }
  }

  // Build imports string, avoiding duplicates
  const importList = Array.from(imports)
  const typingImports = importList.filter(
    (imp) => imp !== "validator" && imp !== "BaseModel",
  )
  const pydanticImports = ["BaseModel"].concat(
    imports.has("validator") ? ["validator"] : [],
  )

  const importString = [
    typingImports.length > 0
      ? `from typing import ${typingImports.join(", ")}`
      : "",
    `from pydantic import ${pydanticImports.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n")

  const validators = validatorLines.length > 0 ? validatorLines.join("\n") : ""

  return `${importString}

class ${interfaceName}(BaseModel):
${propertyLines.join("\n")}${validators}
`
}

async function main() {
  try {
    const sourceDir = join(__dirname, "../../src")
    const outputDir = join(__dirname, "output")

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Get all TypeScript files
    const files = (await glob("**/*.ts", { cwd: sourceDir })) as string[]
    const fullPaths = files.map((f) => join(sourceDir, f))

    // Create TypeScript program
    const program = ts.createProgram(fullPaths, {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    })

    const checker = program.getTypeChecker()

    // Process each source file
    for (const sourceFile of program.getSourceFiles()) {
      if (
        !sourceFile.isDeclarationFile &&
        sourceFile.fileName.startsWith(sourceDir)
      ) {
        // Get interfaces and type aliases
        ts.forEachChild(sourceFile, (node) => {
          if (
            ts.isInterfaceDeclaration(node) ||
            ts.isTypeAliasDeclaration(node)
          ) {
            const type = checker.getTypeAtLocation(node)
            const properties = type.getProperties()
            if (properties.length > 0) {
              const pydanticModel = generatePydanticModel(
                node.name.text,
                type,
                checker,
              )
              const outputPath = join(
                outputDir,
                `${node.name.text.toLowerCase()}.py`,
              )
              writeFileSync(outputPath, pydanticModel)
              console.log(`Generated ${outputPath}`)
            }
          }
        })
      }
    }

    console.log("Pydantic model generation completed successfully!")
  } catch (error) {
    console.error("Error generating Pydantic models:", error)
    process.exit(1)
  }
}

// Run the generator
main().catch(console.error)
