import { expect, test } from "bun:test"
import { pcb_stackup } from "src"
import { jlc_stackup } from "./fixtures/jlc-stackup"

test("stackup rejects non-positive copper conductivity", () => {
  for (const conductivity of [0, -1, Infinity, NaN]) {
    expect(
      pcb_stackup.safeParse({
        ...jlc_stackup,
        layers: [
          {
            layer_type: "copper",
            layer: "top",
            thickness: "0.035mm",
            conductivity,
          },
        ],
      }).success,
    ).toBe(false)
  }
})
