import fs from "node:fs"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"

// Read all the files in the src/pcb directory
const pcbDir = path.join(__dirname, "../src/pcb")
const fileContents = fs
  .readdirSync(pcbDir)
  .map((file) => path.join(pcbDir, file))
  .filter((file) => file.endsWith(".ts"))
  .map((file) =>
    fs
      .readFileSync(file, "utf8")
      // remove any lines that import
      .replace(/^import .*;$/gm, "")
      // remove any lines with z.infer, z.input, or z.output
      .replace(/^type .*=.*z\.(infer|input|output)<.*>$/gm, ""),
  )

// Extract the type definitions from the file contents
const anthropic = new Anthropic()

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: `Extract all the exported type definitions from the following file contents. Do not include deprecated types. Return as a \`\`\`ts codeblock.\n\n${fileContents.join("\n")}`,
    },
  ],
})

const resText: string = (msg as any).content[0].text

const codefence = resText
  .split("```")[1]!
  .replace(/^ts\n/, "")
  .replace(/^typescript\n/, "")

// Write to docs/PCB_COMPONENT_OVERVIEW.md
const template = `# Circuit JSON Specification: PCB Component Overview

> Created at ${new Date().toISOString()}
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/PCB_COMPONENT_OVERVIEW.md

Any type below can be imported from \`circuit-json\`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example \`PcbComponent\` has a \`pcb_component.parse\` function that you
can also import.

\`\`\`ts
${codefence}
\`\`\`
`.trim()

fs.writeFileSync(
  path.join(__dirname, "../docs/PCB_COMPONENT_OVERVIEW.md"),
  template,
)
