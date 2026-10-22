import { expect, test } from "bun:test"
import { any_circuit_element, pcb_board, type PcbBoardInput } from "src"

test("yellow flex coverlay survives the Circuit JSON union", () => {
  const input = {
    type: "pcb_board",
    material: "flex",
    center: { x: 0, y: 0 },
    coverlay_color: "yellow",
  } satisfies PcbBoardInput
  const board = pcb_board.parse(input)
  expect(board.coverlay_color).toBe("yellow")
  expect(any_circuit_element.parse(board)).toEqual(board)
})

test("black flex coverlay is preserved separately from solder mask", () => {
  const board = pcb_board.parse({
    type: "pcb_board",
    material: "flex",
    center: { x: 0, y: 0 },
    coverlay_color: "black",
    solder_mask_color: "green",
  })
  expect(board.coverlay_color).toBe("black")
  expect(board.solder_mask_color).toBe("green")
})

test("white flex coverlay is accepted", () => {
  expect(
    pcb_board.parse({
      type: "pcb_board",
      material: "flex",
      center: { x: 0, y: 0 },
      coverlay_color: "white",
    }).coverlay_color,
  ).toBe("white")
})

test("omitted coverlay color remains unspecified", () => {
  expect(
    pcb_board.parse({ type: "pcb_board", center: { x: 0, y: 0 } })
      .coverlay_color,
  ).toBeUndefined()
})

test("unsupported coverlay colors are rejected", () => {
  expect(
    pcb_board.safeParse({
      type: "pcb_board",
      material: "flex",
      center: { x: 0, y: 0 },
      coverlay_color: "green",
    }).success,
  ).toBe(false)
})

test("custom coverlay colors are rejected", () => {
  expect(
    pcb_board.safeParse({
      type: "pcb_board",
      material: "flex",
      center: { x: 0, y: 0 },
      coverlay_color: "#000000",
    }).success,
  ).toBe(false)
})
