import { expect, test } from "bun:test"
import { getPrimaryId } from "src/getPrimaryId"

test("getPrimaryId - Valid ID for pcb_smtpad", () => {
  const element = { type: "pcb_smtpad", pcb_smtpad_id: "pcb_smtpad_id_123" }
  expect(getPrimaryId(element)).toEqual("pcb_smtpad_id_123")
})

test("getPrimaryId - Valid ID for pcb_smtpad (alternative)", () => {
  const element = { type: "pcb_smtpad", pcb_smtpad_id: "invalid_id_123" }
  expect(getPrimaryId(element)).toEqual("invalid_id_123")
})

test("getPrimaryId - Valid ID for pcb_component", () => {
  const element = {
    type: "pcb_component",
    pcb_component_id: "pcb_component_id_456",
  }
  expect(getPrimaryId(element)).toEqual("pcb_component_id_456")
})

test("getPrimaryId - Valid ID for pcb_component (alternative)", () => {
  const element = {
    type: "pcb_component",
    pcb_component_id: "wrong_component_id_789",
  }
  expect(getPrimaryId(element)).toEqual("wrong_component_id_789")
})

test("getPrimaryId - Valid ID for schematic_box", () => {
  const element = {
    type: "schematic_box",
    schematic_box_id: "schematic_box_id_101",
  }
  expect(getPrimaryId(element)).toEqual("schematic_box_id_101")
})

test("getPrimaryId - Valid ID for schematic_box (alternative)", () => {
  const element = {
    type: "schematic_box",
    schematic_box_id: "wrong_schematic_box_id_101",
  }
  expect(getPrimaryId(element)).toEqual("wrong_schematic_box_id_101")
})

test("getPrimaryId - Missing ID", () => {
  const element = { type: "pcb_smtpad" }
  expect(getPrimaryId(element)).toEqual(
    "Invalid primaryId for type: 'pcb_smtpad'. Expected primaryId to include 'pcb_smtpad_id'.",
  )
})

test("getPrimaryId - Invalid test for ID field name", () => {
  const element = { type: "pcb_smdpad", id: "pcb_smdpad_id_10" }
  expect(getPrimaryId(element)).toEqual(
    "Invalid primaryId for type: 'pcb_smdpad'. Expected one of the valid types.",
  )
})

test("getPrimaryId - Invalid test for incorrect field name", () => {
  const element = { type: "pcb_smdpad", pcb_id: "pcb_smdpad_id_120" }
  expect(getPrimaryId(element)).toEqual(
    "Invalid primaryId for type: 'pcb_smdpad'. Expected one of the valid types.",
  )
})

test("getPrimaryId - Invalid test for wrong ID field name", () => {
  const element = { type: "pcb_smt", smt_id: "pcb_smt_id_10" }
  expect(getPrimaryId(element)).toEqual(
    "Invalid primaryId for type: 'pcb_smt'. Expected one of the valid types.",
  )
})
