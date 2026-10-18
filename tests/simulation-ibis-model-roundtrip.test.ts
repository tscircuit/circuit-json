import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { model } from "./fixtures/simulation-ibis"
test("IBIS model assets and named physical pin bindings survive the public union", () => {
  expect(any_circuit_element.parse(model)).toMatchObject(model)
})
