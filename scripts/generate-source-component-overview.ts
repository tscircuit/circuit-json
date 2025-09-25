import fs from "node:fs"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"

// Read all the files in the src/source directory
const sourceDir = path.join(__dirname, "../src/source")
const fileContents = fs
  .readdirSync(sourceDir, { recursive: true })
  .filter((file): file is string => typeof file === "string")
  .map((file) => path.join(sourceDir, file))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => fs.readFileSync(file, "utf8"))

// Extract the type definitions from the file contents
const anthropic = new Anthropic()

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: `Extract/write interfaces for all the exported source component types from the following file contents. Do not include deprecated types. If it's a zod type, return the type without zod references (you may need to write a new type definition). Return as a \`\`\`ts codeblock.\n\n${fileContents.join("\n")}`,
    },
  ],
})

const resText: string = (msg as any).content[0].text

const codefence = resText
  .split("```")[1]!
  .replace(/^ts\n/, "")
  .replace(/^typescript\n/, "")

// Write to docs/SOURCE_COMPONENT_OVERVIEW.md
const template = `# Circuit JSON Specification: Source Component Overview

> Created at ${new Date().toISOString()}
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/SOURCE_COMPONENT_OVERVIEW.md

Any type below can be imported from \`circuit-json\`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example \`SourceComponent\` has a \`source_component.parse\` function that you
can also import.

\`\`\`ts
${codefence}
\`\`\`
`.trim()

fs.writeFileSync(
  path.join(__dirname, "../docs/SOURCE_COMPONENT_OVERVIEW.md"),
  template,
)
