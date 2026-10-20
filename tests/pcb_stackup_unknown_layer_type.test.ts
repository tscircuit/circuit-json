import { expect, test } from "bun:test"
import { pcb_stackup } from "src"
import { jlc_stackup } from "./fixtures/jlc-stackup"

test("stackup rejects an unknown layer type", () => {
  expect(
    pcb_stackup.safeParse({
      ...jlc_stackup,
      layers: [{ layer_type: "silkscreen", thickness: "0.035mm" }],
    }).success,
  ).toBe(false)
})
