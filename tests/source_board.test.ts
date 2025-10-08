import { expect, test } from "bun:test"
import { source_board } from "../src/source/source_board"

test("source_board.title defaults to undefined", () => {
  const board = source_board.parse({
    type: "source_board",
    source_board_id: "board1",
    source_group_id: "group1",
  })

  expect(board.title).toBeUndefined()
})

test("source_board.title can be set", () => {
  const board = source_board.parse({
    type: "source_board",
    source_board_id: "board1",
    source_group_id: "group1",
    title: "Main board",
  })

  expect(board.title).toBe("Main board")
})

test("source_board requires a source_group_id", () => {
  const result = source_board.safeParse({
    type: "source_board",
    source_board_id: "board1",
  })

  expect(result.success).toBeFalse()

  if (!result.success) {
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        path: ["source_group_id"],
        code: "invalid_type",
      }),
    )
  }
})
