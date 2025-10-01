import fs from "node:fs"
import path from "node:path"
import { glob } from "glob"
import ts from "typescript"

function parseExportBlocks(content: string): string[] {
  const source = ts.createSourceFile(
    "temp.ts",
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const blocks: string[] = []
  const visit = (node: ts.Node) => {
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const comments = ts.getLeadingCommentRanges(content, node.pos) || []
      let commentText = ""
      for (const range of comments) {
        commentText += content.slice(range.pos, range.end)
      }
      blocks.push(commentText + content.slice(node.getStart(source), node.end))
    }
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(source, visit)
  return blocks
}

interface ElementDoc {
  name: string
  description: string
  interface: string
  otherInterfaces: string[]
}

async function generateDocs() {
  const sourceFiles = await glob(
    "src/{source,pcb,schematic,simulation,cad}/**/*.ts",
  )

  const sections = {
    source: [] as ElementDoc[],
    pcb: [] as ElementDoc[],
    cad: [] as ElementDoc[],
    schematic: [] as ElementDoc[],
    simulation: [] as ElementDoc[],
    misc: [] as ElementDoc[],
  }

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8")
    const section =
      file.includes("\\source\\") || file.includes("/source/")
        ? "source"
        : file.includes("\\simulation\\") || file.includes("/simulation/")
          ? "simulation"
          : file.includes("\\cad\\") || file.includes("/cad/")
            ? "cad"
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

    const exportBlocks = parseExportBlocks(content)

    const cleanBlocks = exportBlocks
      .filter((block) => {
        const interfaceIndex = block.indexOf("export interface")
        const typeIndex = block.indexOf("export type")
        const exportIndex =
          interfaceIndex !== -1
            ? interfaceIndex
            : typeIndex !== -1
              ? typeIndex
              : 0
        const beforeExport = block.slice(0, exportIndex)
        const comments = beforeExport.match(/\/\*\*[\s\S]*?\*\/\s*/g)
        const comment =
          comments && comments.length > 0 ? comments[comments.length - 1]! : ""
        const isDeprecated = comment.includes("@deprecated")
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
          .replace(/\n\s*\*\//g, " */\n")
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

  toc += "  - [CAD Components](#cad-components)\n"
  for (const elem of sections.cad.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "  - [PCB Elements](#pcb-elements)\n"
  for (const elem of sections.pcb.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "  - [Schematic Elements](#schematic-elements)\n"
  for (const elem of sections.schematic.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "  - [Simulation Elements](#simulation-elements)\n"
  for (const elem of sections.simulation.sort((a, b) =>
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
    const sourceFilePath = sourceFiles.find((file) => {
      const basename = path.basename(file, ".ts")
      const primaryName = basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return primaryName === elem.name
    })
    const githubSourceLink = sourceFilePath
      ? `https://github.com/tscircuit/circuit-json/blob/main/${sourceFilePath}`
      : null

    docs += `### ${elem.name}\n\n`
    if (githubSourceLink) {
      docs += `[Source](${githubSourceLink})\n\n`
    }
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

  docs += "## CAD Components\n\n"
  for (const elem of sections.cad.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const sourceFilePath = sourceFiles.find((file) => {
      const basename = path.basename(file, ".ts")
      const primaryName = basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return primaryName === elem.name
    })
    const githubSourceLink = sourceFilePath
      ? `https://github.com/tscircuit/circuit-json/blob/main/${sourceFilePath}`
      : null

    docs += `### ${elem.name}\n\n`
    if (githubSourceLink) {
      docs += `[Source](${githubSourceLink})\n\n`
    }
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
    const sourceFilePath = sourceFiles.find((file) => {
      const basename = path.basename(file, ".ts")
      const primaryName = basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return primaryName === elem.name
    })
    const githubSourceLink = sourceFilePath
      ? `https://github.com/tscircuit/circuit-json/blob/main/${sourceFilePath}`
      : null

    docs += `### ${elem.name}\n\n`
    if (githubSourceLink) {
      docs += `[Source](${githubSourceLink})\n\n`
    }
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
    const sourceFilePath = sourceFiles.find((file) => {
      const basename = path.basename(file, ".ts")
      const primaryName = basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return primaryName === elem.name
    })
    const githubSourceLink = sourceFilePath
      ? `https://github.com/tscircuit/circuit-json/blob/main/${sourceFilePath}`
      : null

    docs += `### ${elem.name}\n\n`
    if (githubSourceLink) {
      docs += `[Source](${githubSourceLink})\n\n`
    }
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

  docs += "## Simulation Elements\n\n"
  for (const elem of sections.simulation.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const sourceFilePath = sourceFiles.find((file) => {
      const basename = path.basename(file, ".ts")
      const primaryName = basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return primaryName === elem.name
    })
    const githubSourceLink = sourceFilePath
      ? `https://github.com/tscircuit/circuit-json/blob/main/${sourceFilePath}`
      : null

    docs += `### ${elem.name}\n\n`
    if (githubSourceLink) {
      docs += `[Source](${githubSourceLink})\n\n`
    }
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

  docs = docs.replace(/\*\/interface/g, "*/\ninterface")
  docs = docs.replace(/= \|/g, "=\n  |")

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
