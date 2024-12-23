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
      // Check for direct enum declarations
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object?.name === "z" &&
        node.callee.property?.name === "enum"
      ) {
        checkEnumValues(node.arguments[0], filePath, errors)
      }

      // Check for object properties
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object?.name === "z" &&
        node.callee.property?.name === "object"
      ) {
        const objectLiteral = node.arguments[0]
        if (objectLiteral && objectLiteral.type === "ObjectExpression") {
          objectLiteral.properties.forEach((prop: any) => {
            // Check property names for camelCase
            const propertyName = prop.key.name || prop.key.value
            if (propertyName && /[A-Z]/.test(propertyName)) {
              errors.push({
                file: filePath,
                line: prop.loc.start.line,
                column: prop.loc.start.column,
                message: `Found camelCase property "${propertyName}" in Zod object`,
              })
            }

            // Recursively check nested properties
            if (prop.value) {
              visit(prop.value)
            }
          })
        }
      }

      // Recursively visit all children
      for (const key in node) {
        if (node[key] && typeof node[key] === "object") {
          visit(node[key])
        }
      }
    }

    function checkEnumValues(
      enumNode: any,
      filePath: string,
      errors: LintError[],
    ) {
      if (enumNode.type === "ArrayExpression") {
        enumNode.elements.forEach((element: any) => {
          if (element.type === "Literal" && typeof element.value === "string") {
            if (!/^[a-z][a-z0-9_]*(?:_[a-z0-9]+)*$/.test(element.value)) {
              errors.push({
                file: filePath,
                line: element.loc.start.line,
                column: element.loc.start.column,
                message: `Found non-snake_case enum value "${element.value}"`,
              })
            }
          }
        })
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

  function processDirectory(dir: string) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (file.endsWith(".ts")) {
        const content = fs.readFileSync(fullPath, "utf8")
        const errors = checkZodSchema(content, fullPath)
        allErrors.push(...errors)
      }
    })
  }

  processDirectory(directory)
  return allErrors
}

// Main execution
const srcDir = path.join(__dirname, "../src")
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
