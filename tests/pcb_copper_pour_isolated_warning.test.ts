import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_copper_pour_isolated_warning,
  type PcbCircuitElement,
} from "../src"

const input = {
  type: "pcb_copper_pour_isolated_warning" as const,
  message: "GND has an isolated copper island on inner1",
  pcb_copper_pour_id: "pcb_copper_pour_1",
  source_net_id: "source_net_1",
  subcircuit_id: "subcircuit_1",
  layer: "inner1" as const,
  center: { x: 5.4, y: 2.2 },
}

test("isolated pour warnings retain copper references and locations in the element union", () => {
  const warning: PcbCircuitElement =
    pcb_copper_pour_isolated_warning.parse(input)
  expect(warning.pcb_copper_pour_isolated_warning_id).toStartWith(
    "pcb_copper_pour_isolated_warning",
  )
  expect(warning.warning_type).toBe("pcb_copper_pour_isolated_warning")
  expect(warning.pcb_copper_pour_id).toBe(input.pcb_copper_pour_id)
  expect(warning.source_net_id).toBe(input.source_net_id)
  expect(warning.center).toEqual(input.center)
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(warning).not.toHaveProperty("error_type")
  expect(warning).not.toHaveProperty("styling_issue_type")
})

test("isolated pour warning locations accept units and net references are optional", () => {
  const warning = pcb_copper_pour_isolated_warning.parse({
    ...input,
    center: { x: "5.4mm", y: "2.2mm" },
    source_net_id: undefined,
    subcircuit_id: undefined,
  })
  expect(warning.center).toEqual(input.center)
  expect(warning.source_net_id).toBeUndefined()
})

test("isolated pour warnings require a pour, location, valid layer and warning type", () => {
  for (const invalid of [
    { pcb_copper_pour_id: undefined },
    { center: undefined },
    { layer: "silkscreen" },
    { type: "pcb_placement_error" },
    { type: "pcb_copper_pour_style_warning" },
  ]) {
    expect(
      pcb_copper_pour_isolated_warning.safeParse({ ...input, ...invalid })
        .success,
    ).toBe(false)
  }
})
