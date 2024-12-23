import fs from "fs"
import path from "path"
import { glob } from "glob"

// Regex patterns for finding Zod objects and enums
const zodObjectPattern = /z\.object\(\s*{([^}]*)}\s*\)/g
const zodEnumPattern = /z\.enum\(\s*\[(([^[\]]*))]\s*\)/g
const propertyPattern = /\s*(\w+)\s*:/g
const enumValuePattern = /"([^"]+)"|'([^']+)'/g

function isCamelCase(str: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(str) && /[A-Z]/.test(str)
}

function isLowerSnakeCase(str: string): boolean {
  return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(str)
}

function checkFile(filePath: string): boolean {
  let hasViolations = false
  const content = fs.readFileSync(filePath, "utf-8")

  // Check z.object() properties for camelCase
  let match: RegExpExecArray | null
  while ((match = zodObjectPattern.exec(content)) !== null) {
    const objectContent = match[1]
    if (!objectContent) continue

    let propMatch: RegExpExecArray | null
    while ((propMatch = propertyPattern.exec(objectContent)) !== null) {
      const propertyName = propMatch[1]
      if (propertyName && isCamelCase(propertyName)) {
        console.error(
          `Error: Found camelCase property "${propertyName}" in Zod object in file: ${filePath}`,
        )
        hasViolations = true
      }
    }
    propertyPattern.lastIndex = 0
  }

  // Reset regex lastIndex
  zodObjectPattern.lastIndex = 0

  // Check z.enum() values for snake_case
  while ((match = zodEnumPattern.exec(content)) !== null) {
    const enumContent = match[1]
    if (!enumContent) continue

    let enumMatch: RegExpExecArray | null
    while ((enumMatch = enumValuePattern.exec(enumContent)) !== null) {
      const enumValue = enumMatch[1] || enumMatch[2] // Handle both single and double quotes
      if (enumValue && !isLowerSnakeCase(enumValue)) {
        console.error(
          `Error: Found non-snake_case enum value "${enumValue}" in file: ${filePath}`,
        )
        hasViolations = true
      }
    }
    enumValuePattern.lastIndex = 0
  }

  return hasViolations
}

async function main() {
  const srcDir = path.join(__dirname, "..", "src")
  const files = await glob("**/*.ts", { cwd: srcDir })

  let hasViolations = false

  for (const file of files) {
    const fullPath = path.join(srcDir, file)
    if (checkFile(fullPath)) {
      hasViolations = true
    }
  }

  if (hasViolations) {
    console.error("\nLinting failed! Please fix the above violations.")
    process.exit(1)
  } else {
    console.log("Design rules check passed!")
  }
}

main().catch((error) => {
  console.error("Error running lint script:", error)
  process.exit(1)
})
