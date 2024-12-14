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
    const section =
      file.includes("\\source\\") || file.includes("/source/")
        ? "source"
        : file.includes("pcb_")
          ? "pcb"
          : file.includes("schematic_")
            ? "schematic"
            : "misc"

    // Convert filename to PascalCase to find primary interface
    const basename = path.basename(file, ".ts")
    const primaryName = basename
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    // Find interface matching filename
    const allInterfacesAndTypes = content.match(
      /(?:\/\*\*[\s\S]*?\*\/\s*)?export (?:interface|type) [^=]*?(?:{\s*[\s\S]*?\n}|\s*=[\s\S]*?(?:\n\n|\n[^\n]))/gm,
    )
    const primaryInterfaceOrType = content.match(
      new RegExp(
        `(?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?export (?:interface|type) ${primaryName}[^=]*?(?:{\\s*[\\s\\S]*?\\n}|\\s*=[\\s\\S]*?(?:\\n\\n|\\n[^\\n]))`,
      ),
    )?.[0]
    if (!primaryInterfaceOrType) {
      console.log(`No primary interface or type found for ${basename}`)
      continue
    }
    // Remove the primary interface from the list
    const otherInterfaces =
      allInterfacesAndTypes?.filter(
        (iface) => !iface.match(new RegExp(`${primaryName}\\s`)),
      ) ?? []

    // Get description if it exists
    const descMatch = primaryInterfaceOrType.match(/\/\*\*\s*(.*?)\s*\*\//)
    const description = descMatch ? descMatch[1]! : ""

    sections[section].push({
      name: primaryName,
      description,
      interface: primaryInterfaceOrType,
      otherInterfaces,
    })
  }

  // Generate table of contents
  let toc = ""

  // Static TOC sections
  toc +=
    "- [Circuit JSON Specification `circuit-json`](#circuit-json-specification-circuit-json)\n"
  toc +=
    "  - [Things You Can Do With Circuit JSON](#things-you-can-do-with-circuit-json)\n"
  toc += "  - [Typescript Usage](#typescript-usage)\n\n"

  // Source Components TOC
  toc += "  - [Source Components](#source-components)\n"
  for (const elem of sections.source.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  // PCB Elements TOC
  toc += "  - [PCB Elements](#pcb-elements)\n"
  for (const elem of sections.pcb.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `   - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  // Schematic Elements TOC
  toc += "  - [Schematic Elements](#schematic-elements)\n"
  for (const elem of sections.schematic.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `    - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

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
    docs += elem.otherInterfaces.map((iface) => `\n\n${iface}`).join("")
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
    docs += elem.otherInterfaces.map((iface) => `\n\n${iface}`).join("")
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
    docs += elem.otherInterfaces.map((iface) => `\n\n${iface}`).join("")
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
