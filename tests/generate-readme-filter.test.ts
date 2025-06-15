import { test, expect } from "bun:test"
import fs from "node:fs"

function parseExportBlocks(content: string): string[] {
  const blocks: string[] = []
  const regex =
    /export\s+(interface|type)\s+[A-Z][^=]*?(?:{[\s\S]*?}|=[^;]*?;)/gm
  for (const match of content.matchAll(regex)) {
    const start = match.index ?? 0
    const before = content.slice(0, start)
    const comments = before.match(/\/\*\*[\s\S]*?\*\//g)
    const comment = comments ? comments[comments.length - 1] : ""
    blocks.push(comment + match[0])
  }
  return blocks
}

function filterBlocks(blocks: string[]): string[] {
  return blocks.filter((block) => {
    const interfaceIndex = block.indexOf("export interface")
    const typeIndex = block.indexOf("export type")
    const exportIndex = interfaceIndex !== -1 ? interfaceIndex : typeIndex
    const beforeExport = block.slice(0, exportIndex)
    const comments = beforeExport.match(/\/\*\*[\s\S]*?\*\/\s*/g)
    const comment = comments ? comments[comments.length - 1] : ""
    const isDeprecated = comment.includes("@deprecated")
    const isZodRelated =
      block.includes("z.") ||
      block.includes("Inferred") ||
      block.includes("Input") ||
      block.includes(".parse(")
    return !isDeprecated && !isZodRelated
  })
}

test("PcbVia interface is retained by docs generator filter", () => {
  const content = fs.readFileSync("src/pcb/pcb_via.ts", "utf8")
  const exportBlocks = parseExportBlocks(content)
  const clean = filterBlocks(exportBlocks)
  expect(clean.some((b) => b.includes("interface PcbVia"))).toBeTrue()
})
