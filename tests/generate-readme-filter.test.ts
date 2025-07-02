import { test, expect } from "bun:test"
import fs from "node:fs"
import ts from "typescript"

function parseExportBlocks(content: string): string[] {
  const source = ts.createSourceFile(
    "tmp.ts",
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

function filterBlocks(blocks: string[]): string[] {
  return blocks.filter((block) => {
    const interfaceIndex = block.indexOf("export interface")
    const typeIndex = block.indexOf("export type")
    const exportIndex = interfaceIndex !== -1 ? interfaceIndex : typeIndex
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
}

test("PcbVia interface is retained by docs generator filter", () => {
  const content = fs.readFileSync("src/pcb/pcb_via.ts", "utf8")
  const exportBlocks = parseExportBlocks(content)
  const clean = filterBlocks(exportBlocks)
  expect(clean.some((b) => b.includes("interface PcbVia"))).toBeTrue()
})

test("SourceFailedToCreateComponentError interface is fully captured", () => {
  const content = fs.readFileSync(
    "src/source/source_failed_to_create_component_error.ts",
    "utf8",
  )
  const exportBlocks = parseExportBlocks(content)
  const clean = filterBlocks(exportBlocks)
  const block = clean.find((b) =>
    b.includes("interface SourceFailedToCreateComponentError"),
  )
  expect(block).toBeDefined()
  expect(block!.includes("schematic_center?")).toBeTrue()
})
