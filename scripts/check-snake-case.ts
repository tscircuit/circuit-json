import fs from "node:fs"
import path from "node:path"
import { parseForESLint } from "@typescript-eslint/parser"

type ASTNode = {
  type: string
  loc?: {
    start: { line: number; column: number }
    end: { line: number; column: number }
  }
  key?: { name?: string; value?: string | number }
  members?: any[]
  comments?: Array<{ value: string; loc: { end: { line: number } } }>
  [key: string]: any
}

interface LintError {
  file: string
  line: number
  column: number
  message: string
}

// Snake case regex
const SNAKE_CASE_REGEX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/

// TypeScript keywords to ignore
const TYPESCRIPT_KEYWORDS = new Set([
  "string",
  "number",
  "boolean",
  "any",
  "unknown",
  "never",
  "void",
  "null",
  "undefined",
  "bigint",
  "symbol",
  "object",
  "function",
  "this",
  "true",
  "false",
  "null",
  "undefined",
  "export",
  "import",
  "type",
  "interface",
  "class",
  "extends",
  "implements",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "abstract",
  "as",
  "is",
  "in",
  "keyof",
  "infer",
  "any",
  "unknown",
  "never",
  "void",
  "null",
  "undefined",
  "object",
  "enum",
  "bigint",
  "symbol",
  "this",
  "intrinsic",
  "unique",
  "readonly",
  "keyof",
  "infer",
  "in",
  "out",
  "infer",
  "is",
  "as",
  "any",
  "unknown",
  "never",
  "void",
  "null",
  "undefined",
])

function checkSnakeCase(code: string, filePath: string): LintError[] {
  const errors: LintError[] = []

  try {
    const { ast } = parseForESLint(code, {
      loc: true,
      range: true,
      tokens: true,
      comment: true,
      sourceType: "module",
      ecmaVersion: "latest",
      ecmaFeatures: {
        jsx: true,
      },
    }) as { ast: ASTNode }

    // Check if a node is ignored by a comment
    function isIgnored(node: ASTNode): boolean {
      if (!node.loc) return false
      const comments = ast.comments || []
      return comments.some(
        (comment) =>
          comment.value.trim() === "@ts-ignore" &&
          comment.loc.end.line === node.loc!.start.line - 1,
      )
    }

    // Visit all nodes in the AST
    function visit(node: ASTNode) {
      if (isIgnored(node)) {
        return
      }

      // Check interface property names
      if (node.type === "TSPropertySignature" && node.key && node.loc) {
        const propName = node.key.name || String(node.key.value || "")
        if (
          propName &&
          !SNAKE_CASE_REGEX.test(propName) &&
          !TYPESCRIPT_KEYWORDS.has(propName)
        ) {
          errors.push({
            file: filePath,
            line: node.loc.start.line,
            column: node.loc.start.column,
            message: `Property "${propName}" is not in snake_case`,
          })
        }
      }

      // Check type alias properties
      if (node.type === "TSTypeLiteral" && node.members) {
        node.members.forEach((member: ASTNode) => {
          if (
            member.type === "TSPropertySignature" &&
            member.key &&
            member.loc
          ) {
            const propName = member.key.name || String(member.key.value || "")
            if (
              propName &&
              !SNAKE_CASE_REGEX.test(propName) &&
              !TYPESCRIPT_KEYWORDS.has(propName)
            ) {
              errors.push({
                file: filePath,
                line: member.loc.start.line,
                column: member.loc.start.column,
                message: `Property "${propName}" is not in snake_case`,
              })
            }
          }
        })
      }

      // Recursively visit all children
      for (const key in node) {
        if (key !== "parent" && node[key] && typeof node[key] === "object") {
          // Only visit object properties that aren't the parent reference
          if (Array.isArray(node[key])) {
            ;(node[key] as any[]).forEach((item) => {
              if (item && typeof item === "object") {
                visit(item)
              }
            })
          } else {
            visit(node[key] as ASTNode)
          }
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

  function processDirectory(dir: string) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
        const content = fs.readFileSync(fullPath, "utf8")
        const errors = checkSnakeCase(content, fullPath)
        allErrors.push(...errors)
      }
    })
  }

  processDirectory(directory)
  return allErrors
}

// Main execution
async function main() {
  console.log("🔍 Checking for non-snake_case property names...\n")

  const srcDir = path.join(__dirname, "../src")
  const errors = lintDirectory(srcDir)

  if (errors.length > 0) {
    console.error("Linting errors found:")
    errors.forEach((error) => {
      console.error(
        `✖ ${error.file}:${error.line}:${error.column} - ${error.message}`,
      )
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

main().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
