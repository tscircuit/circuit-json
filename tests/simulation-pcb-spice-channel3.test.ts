import { expect, test } from "bun:test"
import { simulation_ibis_model } from "../src/simulation/simulation_ibis_model"
import { model } from "./fixtures/simulation-ibis"

test("IBIS assets preserve and validate optional SHA-256 digests", () => {
  const sha256 = "aB01".repeat(16)
  const withDigest = {
    ...model,
    ibis_model_asset: { ...model.ibis_model_asset, sha256 },
  }
  expect(simulation_ibis_model.parse(withDigest).ibis_model_asset).toEqual(
    withDigest.ibis_model_asset,
  )
  for (const invalid of ["a".repeat(63), "a".repeat(65), "g".repeat(64)]) {
    expect(() =>
      simulation_ibis_model.parse({
        ...withDigest,
        ibis_model_asset: { ...withDigest.ibis_model_asset, sha256: invalid },
      }),
    ).toThrow()
  }
})
