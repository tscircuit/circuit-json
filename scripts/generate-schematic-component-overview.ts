import Anthropic from "@anthropic-ai/sdk"
import fs from "node:fs"
import path from "node:path"

// Read all the files in the src/schematic directory
const schematicDir = path.join(__dirname, "../src/schematic")
const fileContents = fs
  .readdirSync(schematicDir)
  .map((file) => path.join(schematicDir, file))
  .filter((file) => file.endsWith(".ts"))
  .map(
    (file) => fs.readFileSync(file, "utf8"),
    // // remove any lines that import
    // .replace(/^import .*;$/gm, "")
    // // remove any lines with z.infer, z.input, or z.output
    // .replace(/^type .*=.*z\.(infer|input|output)<.*>$/gm, ""),
  )

// Extract the type definitions from the file contents
const anthropic = new Anthropic()

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: `Extract/write interfaces all the exported type definitions from the following file contents. Do not include deprecated types. If it's a zod type, return the type without zod references (you may need to write a new type definition). Return as a \`\`\`ts codeblock.\n\n${fileContents.join("\n")}`,
    },
  ],
})

const resText: string = (msg as any).content[0].text

const codefence = resText
  .split("```")[1]!
  .replace(/^ts\n/, "")
  .replace(/^typescript\n/, "")

// Write to docs/SCHEMATIC_COMPONENT_OVERVIEW.md
const template = `# Circuit JSON Specification: Schematic Component Overview

> Created at ${new Date().toISOString()}
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SCHEMATIC_COMPONENT_OVERVIEW.md

Any type below can be imported from \`circuit-json\`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example \`SchematicComponent\` has a \`schematic_component.parse\` function that you
can also import.

\`\`\`ts
${codefence}
\`\`\`
`.trim()

fs.writeFileSync(
  path.join(__dirname, "../docs/SCHEMATIC_COMPONENT_OVERVIEW.md"),
  template,
)
