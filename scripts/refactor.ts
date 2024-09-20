import Anthropic from "@anthropic-ai/sdk"
// @ts-ignore
import refactorTemplate from "./refactor-template.md" with { type: "text" }
import fs from "node:fs"

const anthropic = new Anthropic()

const filePath = "./src/pcb/pcb_board.ts"
const fileContents = fs.readFileSync(filePath, "utf8")

const msg = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
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
