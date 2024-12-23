import fs from "node:fs"
import path from "node:path"
import * as parser from "@typescript-eslint/parser"

interface LintError {
  file: string
  line: number
  column: number
  message: string
}

function checkZodSchema(code: string, filePath: string): LintError[] {
  const errors: LintError[] = []

  try {
    const ast = parser.parse(code, {
      loc: true,
      range: true,
      tokens: true,
    })

    // Visit all nodes in the AST
    function visit(node: any) {
      if (
        node.type === "CallExpression" &&
        node.callee.object?.name === "z" &&
        node.callee.property?.name === "object"
      ) {
        // Check the object literal inside z.object({...})
        const objectLiteral = node.arguments[0]
        if (objectLiteral && objectLiteral.type === "ObjectExpression") {
          objectLiteral.properties.forEach((prop: any) => {
            const propertyName = prop.key.name || prop.key.value

            // Check for camelCase
            if (/[A-Z]/.test(propertyName)) {
              errors.push({
                file: filePath,
                line: prop.loc.start.line,
                column: prop.loc.start.column,
                message: `Property "${propertyName}" uses camelCase. Use snake_case instead.`,
              })
            }

            // Check enums
            if (
              prop.value.type === "CallExpression" &&
              prop.value.callee.object?.name === "z" &&
              prop.value.callee.property?.name === "enum"
            ) {
              const enumValues = prop.value.arguments[0]
              if (enumValues.type === "ArrayExpression") {
                enumValues.elements.forEach((element: any) => {
                  const enumValue = element.value
                  if (!/^[a-z][a-z0-9_]*$/.test(enumValue)) {
                    errors.push({
                      file: filePath,
                      line: element.loc.start.line,
                      column: element.loc.start.column,
                      message: `Enum value "${enumValue}" should be in lower snake_case.`,
                    })
                  }
                })
              }
            }
          })
        }
      }

      // Recursively visit all child nodes
      for (const key in node) {
        if (node[key] && typeof node[key] === "object") {
          visit(node[key])
        }
      }
    }

    visit(ast)
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
  }

  return errors
}

function lintDirectory(directory: string): LintError[] {
  const allErrors: LintError[] = []

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(directory, file))

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8")
    const errors = checkZodSchema(content, file)
    allErrors.push(...errors)
  })

  return allErrors
}

// Main execution
const srcDir = path.join(__dirname, "../src/pcb")
const errors = lintDirectory(srcDir)

if (errors.length > 0) {
  console.error("Linting errors found:")
  errors.forEach((error) => {
    console.error(
      `${error.file}:${error.line}:${error.column} - ${error.message}`,
    )
  })
  process.exit(1)
} else {
  console.log("No linting errors found.")
  process.exit(0)
}
