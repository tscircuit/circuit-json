import { test, expect } from "bun:test"
import { source_board } from "src/source/source_board"

test("source_board schema is defined", () => {
  expect(source_board).toBeDefined()
  expect(typeof source_board).toBe("object")
})

test("source_board has type literal", () => {
  expect(source_board.shape.type).toBeDefined()
})

test("source_board has source_board_id field", () => {
  expect(source_board.shape.source_board_id).toBeDefined()
})
