import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_clearance_rule,
  type PcbClearanceRule,
} from "../src"

test("board parsing retains scoped clearance and rejects invalid distances", () => {
  const rule: PcbClearanceRule = {
    name: "EARTH outer",
    enabled: true,
    priority: 1,
    clearance: 4.14,
    scope1: {
      type: "and",
      scopes: [
        { type: "net", net_ids: ["source_net_earth"] },
        { type: "layer", layers: ["top", "bottom"] },
      ],
    },
    scope2: {
      type: "not",
      scope: { type: "net", net_ids: ["source_net_earth"] },
    },
  }
  const board = any_circuit_element.parse({
    type: "pcb_board",
    center: { x: 0, y: 0 },
    clearance_rules: [rule],
  })
  expect(board.type).toBe("pcb_board")
  if (board.type !== "pcb_board") throw new Error("Expected board")
  expect(board.clearance_rules).toEqual([rule])
  for (const clearance of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    expect(pcb_clearance_rule.safeParse({ ...rule, clearance }).success).toBe(
      false,
    )
  }
  expect(pcb_clearance_rule.safeParse({ ...rule, priority: 0 }).success).toBe(
    false,
  )
  expect(pcb_clearance_rule.parse({ ...rule, clearance: 0 }).clearance).toBe(0)
  expect(
    pcb_clearance_rule.parse({
      ...rule,
      scope1: { type: "unsupported", expression: "InRoom('HV')" },
    }).scope1,
  ).toEqual({ type: "unsupported", expression: "InRoom('HV')" })
})
