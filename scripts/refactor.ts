import Anthropic from "@anthropic-ai/sdk"
// @ts-ignore
import refactorTemplate from "./refactor-template.md" with { type: "text" }
import fs from "node:fs"

const anthropic = new Anthropic()

const filePaths = [
  "./src/pcb/pcb_fabrication_note_path.ts",
  "./src/pcb/pcb_component.ts",
  "./src/pcb/pcb_port_not_matched_error.ts",
  "./src/pcb/pcb_silkscreen_text.ts",
  "./src/pcb/pcb_trace_error.ts",
  "./src/pcb/pcb_silkscreen_pill.ts",
  "./src/pcb/pcb_plated_hole.ts",
  "./src/pcb/pcb_fabrication_note_text.ts",
  "./src/pcb/pcb_silkscreen_circle.ts",
  "./src/pcb/pcb_silkscreen_path.ts",
  "./src/pcb/pcb_text.ts",
  "./src/pcb/pcb_keepout.ts",
  "./src/pcb/pcb_via.ts",
  // "./src/pcb/properties/supplier_name.ts",
  // "./src/pcb/properties/pcb_route_hints.ts",
  // "./src/pcb/properties/layer_ref.ts",
  // "./src/pcb/properties/route_hint_point.ts",
  "./src/pcb/pcb_silkscreen_oval.ts",
  "./src/pcb/pcb_placement_error.ts",
  "./src/pcb/pcb_port.ts",
  "./src/pcb/pcb_silkscreen_rect.ts",
  "./src/pcb/pcb_trace_hint.ts",
  "./src/pcb/pcb_smtpad.ts",
  "./src/pcb/pcb_silkscreen_line.ts",
  "./src/pcb/pcb_hole.ts",
  "./src/pcb/pcb_trace.ts",
  // "./src/pcb/pcb_board.ts",
]

for (const filePath of filePaths) {
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
}
