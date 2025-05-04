import fs from "node:fs"
import path from "node:path"
import { glob } from "glob"

interface ElementDoc {
  name: string
  description: string
  interface: string
  otherInterfaces: string[]
}

async function generateDocs() {
  const sourceFiles = await glob("src/{source,pcb,schematic}/**/*.ts")

  const sections = {
    source: [] as ElementDoc[],
    pcb: [] as ElementDoc[],
    schematic: [] as ElementDoc[],
    misc: [] as ElementDoc[],
  }

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8")
    const section =
      file.includes("\\source\\") || file.includes("/source/")
        ? "source"
        : file.includes("pcb_")
          ? "pcb"
          : file.includes("schematic_")
            ? "schematic"
            : "misc"

    const basename = path.basename(file, ".ts")
    const primaryName = basename
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    const exportBlocks =
      content.match(
        /\/\*\*[\s\S]*?\*\/\s*export\s+(interface|type)\s+[A-Z][^=]*?(?:{[\s\S]*?}|=[^;]*?;)|export\s+(interface|type)\s+[A-Z][^=]*?(?:{[\s\S]*?}|=[^;]*?;)/gm,
      ) ?? []

    const cleanBlocks = exportBlocks
      .filter((block) => {
        const isDeprecated = block.includes("@deprecated")
        const isZodRelated =
          block.includes("z.") ||
          block.includes("Inferred") ||
          block.includes("Input") ||
          block.includes(".parse(")
        return !isDeprecated && !isZodRelated
      })
      .map((block) => {
        const cleaned = block
          // Remove Zod-specific code
          .replace(/z\.(input|infer|output)<[^>]*>/g, "")
          .replace(/\.optional\(\)/g, "?")
          .replace(/z\.[a-zA-Z]+\(/g, "")
          .replace(/\)\./g, "")
          .replace(/\)\)/g, ")")
          // Format JSDoc comment
          .replace(/\/\*\*\s*\n\s*\*\s*/g, "/** ")
          .replace(/\n\s*\*\//g, " */")
          // Clean up whitespace while preserving structure
          .replace(/{\n\s*([^}]*)\n\s*}/g, (_, content) => {
            const lines = content.trim().split("\n")
            const formattedLines = lines.map(
              (line: string) => `  ${line.trim()}`,
            )
            return `{\n${formattedLines.join("\n")}\n}`
          })
          // Clean up type definitions
          .replace(/export\s+(interface|type)\s+/g, "$1 ")
          .replace(/\s*=\s*{/g, " {")
          .replace(/;\s*$/gm, "")
          // Fix spacing around special characters
          .replace(/\s*\|\s*/g, " | ")
          .replace(/\s*:\s*/g, ": ")
          .replace(/\s*,\s*\n/g, ",\n")

        return cleaned
      })

    const primaryBlock = cleanBlocks.find((block) => {
      const variations = [
        primaryName,
        primaryName.replace(/([A-Z])/g, "_$1").toLowerCase(),
        basename
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(""),
      ]

      return variations.some(
        (variation) =>
          block.includes(`interface ${variation}`) ||
          block.includes(`type ${variation} =`),
      )
    })

    if (!primaryBlock) {
      console.log(`No primary interface found for ${basename}`)
      continue
    }

    const descMatch = primaryBlock.match(/\/\*\*\s*(.*?)\s*\*\//)
    const description = descMatch ? descMatch[1]! : ""

    const otherInterfaces = cleanBlocks.filter(
      (block) =>
        !block.includes(`interface ${primaryName}`) &&
        !block.includes(`type ${primaryName} =`),
    )

    sections[section].push({
      name: primaryName,
      description,
      interface: primaryBlock,
      otherInterfaces,
    })
  }

  let toc = ""

  toc +=
    "- [Circuit JSON Specification `circuit-json`](#circuit-json-specification-circuit-json)\n"
  toc +=
    "  - [Things You Can Do With Circuit JSON](#things-you-can-do-with-circuit-json)\n"
  toc += "  - [Typescript Usage](#typescript-usage)\n\n"

  toc += "  - [Source Components](#source-components)\n"
  for (const elem of sections.source.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "\n  - [PCB Elements](#pcb-elements)\n"
  for (const elem of sections.pcb.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "\n  - [Schematic Elements](#schematic-elements)\n"
  for (const elem of sections.schematic.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }
  toc += "\n"

  let docs = ""
  docs += "## Source Components\n\n"
  for (const elem of sections.source.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    docs += `### ${elem.name}\n\n`
    if (elem.description) {
      docs += `${elem.description}\n\n`
    }
    docs += "```typescript\n"
    docs += elem.interface
    if (elem.otherInterfaces.length > 0) {
      docs += `\n\n${elem.otherInterfaces.join("\n\n")}`
    }
    docs += "\n```\n\n"
  }

  docs += "## PCB Elements\n\n"
  for (const elem of sections.pcb.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    docs += `### ${elem.name}\n\n`
    if (elem.description) {
      docs += `${elem.description}\n\n`
    }
    docs += "```typescript\n"
    docs += elem.interface
    if (elem.otherInterfaces.length > 0) {
      docs += `\n\n${elem.otherInterfaces.join("\n\n")}`
    }
    docs += "\n```\n\n"
  }

  docs += "## Schematic Elements\n\n"
  for (const elem of sections.schematic.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    docs += `### ${elem.name}\n\n`
    if (elem.description) {
      docs += `${elem.description}\n\n`
    }
    docs += "```typescript\n"
    docs += elem.interface
    if (elem.otherInterfaces.length > 0) {
      docs += `\n\n${elem.otherInterfaces.join("\n\n")}`
    }
    docs += "\n```\n\n"
  }

  const readme = fs.readFileSync("README.md", "utf8")

  const tocRegex = /<!-- toc:start -->[\s\S]*?<!-- toc:end -->/
  let newReadme = readme.replace(
    tocRegex,
    `<!-- toc:start -->\n${toc}<!-- toc:end -->`,
  )

  const docsRegex =
    /<!-- circuit-json-docs:start -->[\s\S]*?<!-- circuit-json-docs:end -->/
  newReadme = newReadme.replace(
    docsRegex,
    `<!-- circuit-json-docs:start -->\n${docs}<!-- circuit-json-docs:end -->`,
  )

  fs.writeFileSync("README.md", newReadme)
}

generateDocs()
