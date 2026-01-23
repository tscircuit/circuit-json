import fs from "node:fs"
import path from "node:path"
import * as parser from "@typescript-eslint/parser"

interface LintError {
  file: string
  line: number
  column: number
  message: string
}

function checkSnakeCase(name: string): boolean {
  return !/[A-Z]/.test(name)
}

function checkCode(code: string, filePath: string): LintError[] {
  const errors: LintError[] = []

  try {
    const ast = parser.parse(code, {
      loc: true,
      range: true,
      tokens: true,
      comment: true,
    })

    function visit(node: any) {
      if (!node) return

      // Check Zod object properties
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object?.name === "z" &&
        node.callee.property?.name === "object"
      ) {
        const objectLiteral = node.arguments[0]
        if (objectLiteral?.type === "ObjectExpression") {
          objectLiteral.properties.forEach((prop: any) => {
            const propertyName = prop.key.name || prop.key.value
            if (propertyName && !checkSnakeCase(propertyName)) {
              errors.push({
                file: filePath,
                line: prop.loc.start.line,
                column: prop.loc.start.column,
                message: `Found non-snake_case property "${propertyName}" in Zod object`,
              })
            }
          })
        }
      }

      // Check TypeScript Interface properties
      if (node.type === "TSPropertySignature") {
        const propertyName = node.key.name || node.key.value
        if (propertyName && !checkSnakeCase(propertyName)) {
          errors.push({
            file: filePath,
            line: node.loc.start.line,
            column: node.loc.start.column,
            message: `Found non-snake_case property "${propertyName}" in Interface`,
          })
        }
      }

      // Check Zod enums
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object?.name === "z" &&
        node.callee.property?.name === "enum"
      ) {
        const enumValues = node.arguments[0]
        if (enumValues?.type === "ArrayExpression") {
          enumValues.elements.forEach((element: any) => {
            if (
              element.type === "Literal" &&
              typeof element.value === "string"
            ) {
              if (!checkSnakeCase(element.value)) {
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

      // Recursively visit children
      for (const key in node) {
        if (node[key] && typeof node[key] === "object") {
          if (Array.isArray(node[key])) {
            node[key].forEach(visit)
          } else {
            visit(node[key])
          }
        }
      }
    }

    visit(ast)
  } catch (error) {
    // console.error(`Error parsing ${filePath}:`, error)
  }

  return errors
}

function lintDirectory(directory: string): LintError[] {
  const allErrors: LintError[] = []

  function processDirectory(dir: string) {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (file.endsWith(".ts")) {
        const content = fs.readFileSync(fullPath, "utf8")
        const errors = checkCode(content, fullPath)
        allErrors.push(...errors)
      }
    })
  }

  processDirectory(directory)
  return allErrors
}

const srcDir = path.join(process.cwd(), "src")
const errors = lintDirectory(srcDir)

if (errors.length > 0) {
  console.error("Snake case linting errors found:")
  errors.forEach((error) => {
    console.error(
      `${error.file}:${error.line}:${error.column} - ${error.message}`,
    )
  })
  process.exit(1)
} else {
  console.log("No snake case linting errors found.")
  process.exit(0)
}
