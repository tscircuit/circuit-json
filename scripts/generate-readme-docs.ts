import fs from "node:fs"
import path from "node:path"
import { glob } from "glob"

interface ElementDoc {
  name: string
  description: string
  interface: string
}

async function generateDocs() {
  // Get all source files
  const sourceFiles = await glob("src/{source,pcb,schematic}/**/*.ts")

  // Read and parse each file to extract interfaces and types
  const sections = {
    source: [] as ElementDoc[],
    pcb: [] as ElementDoc[],
    schematic: [] as ElementDoc[],
    misc: [] as ElementDoc[],
  }

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8")
    const section = file.includes("/source/")
      ? "source"
      : file.includes("pcb_")
        ? "pcb"
        : file.includes("schematic_")
          ? "schematic"
          : "misc"

    // Extract interfaces with descriptions and definitions
    const interfaces =
      content.match(
        /(\/\*\*[\s\S]*?\*\/\s*)?export interface [A-Za-z]+[\s\S]*?}/g,
      ) || []

    for (const int of interfaces) {
      const nameMatch = int.match(/export interface ([A-Za-z]+)/)
      if (!nameMatch) continue

      const name = nameMatch[1] ?? ""
      const descMatch = int.match(/\/\*\*\s*(.*?)\s*\*\//) ?? ""
      const description = descMatch ? descMatch[1]! : ""

      sections[section].push({
        name,
        description,
        interface: int,
      })
    }
  }

  // Generate table of contents
  let toc = "## Table of Contents\n\n"

  // Source Components TOC
  toc += "### [Source Components](#source-components)\n"
  for (const elem of sections.source.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `- [${elem.name}](#${elem.name.toLowerCase()})\n`
  }
  toc += "\n"

  // PCB Elements TOC
  toc += "### [PCB Elements](#pcb-elements)\n"
  for (const elem of sections.pcb.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `- [${elem.name}](#${elem.name.toLowerCase()})\n`
  }
  toc += "\n"

  // Schematic Elements TOC
  toc += "### [Schematic Elements](#schematic-elements)\n"
  for (const elem of sections.schematic.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `- [${elem.name}](#${elem.name.toLowerCase()})\n`
  }
  toc += "\n"

  // Generate sections with interface definitions
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
    docs += "\n```\n\n"
  }

  // Update README.md
  const readme = fs.readFileSync("README.md", "utf8")

  // Replace content between toc tags
  const tocRegex = /<!-- toc:start -->[\s\S]*?<!-- toc:end -->/
  let newReadme = readme.replace(
    tocRegex,
    `<!-- toc:start -->\n${toc}<!-- toc:end -->`,
  )

  // Replace content between circuit-json-docs tags
  const docsRegex =
    /<!-- circuit-json-docs:start -->[\s\S]*?<!-- circuit-json-docs:end -->/
  newReadme = newReadme.replace(
    docsRegex,
    `<!-- circuit-json-docs:start -->\n${docs}<!-- circuit-json-docs:end -->`,
  )

  fs.writeFileSync("README.md", newReadme)
}

generateDocs()
