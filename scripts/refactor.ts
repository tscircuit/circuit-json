import fs from "node:fs"
import Anthropic from "@anthropic-ai/sdk"
// @ts-ignore
import refactorTemplate from "./refactor-template.md" with { type: "text" }

const anthropic = new Anthropic()

const filePaths = [
  // "./src/pcb/pcb_hole.ts",
  // "./src/pcb/pcb_plated_hole.ts",
  // "./src/pcb/pcb_smtpad.ts",
].slice(0, 1)

for (const filePath of filePaths) {
  const fileContents = fs.readFileSync(filePath, "utf8")

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `${refactorTemplate.replace(/\$\{PATHNAME\}/g, filePath).replace(/\$\{FILECONTENTS\}/g, fileContents)}`,
      },
    ],
  })

  const resText: string = (msg as any).content[0].text
    .split("```")[1]
    .replace(/^ts\n/, "")

  // Replace the file
  console.log(`Replacing ${filePath} with ai-refactored version`)
  fs.writeFileSync(filePath, resText)
}
