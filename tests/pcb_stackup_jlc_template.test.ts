import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_stackup,
  type PcbCircuitElement,
  type PcbStackup,
} from "src"
import { jlc_stackup } from "./fixtures/jlc-stackup"

test("JLCPCB stackup normalizes lengths and survives JSON round trips", () => {
  const parsed = any_circuit_element.parse(jlc_stackup)
  if (parsed.type !== "pcb_stackup") throw new Error("Expected pcb_stackup")

  const stackup: PcbStackup = parsed
  const circuit_element: PcbCircuitElement = stackup
  expect(circuit_element.type).toBe("pcb_stackup")
  expect(stackup.pcb_stackup_id).toMatch(/^pcb_stackup_/)
  expect(stackup.pcb_board_id).toBe("pcb_board_1")
  expect(stackup.layers).toMatchObject([
    { ...jlc_stackup.layers[0], thickness: 0.035 },
    { ...jlc_stackup.layers[1], thickness: 0.0994 },
    { ...jlc_stackup.layers[2], thickness: 0.0152 },
    { ...jlc_stackup.layers[3], thickness: 1.265 },
    { ...jlc_stackup.layers[4], thickness: 0.0152 },
    { ...jlc_stackup.layers[5], thickness: 0.0994 },
    { ...jlc_stackup.layers[6], thickness: 0.035 },
  ])
  expect(pcb_stackup.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
})
