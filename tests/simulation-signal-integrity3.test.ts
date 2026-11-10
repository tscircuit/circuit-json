import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  signal,
  endpoint,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("differential endpoints select models while arrays mean multiple receivers", () => {
  expect(
    circuitJson.simulation_signal.parse({
      ...signal,
      driver: endpoint,
      receivers: [endpoint],
    }),
  ).toMatchObject({ driver: endpoint, receivers: [endpoint] })
  expect(
    circuitJson.signal_endpoint.parse({
      ...endpoint,
      p_ibis_model_name: undefined,
      n_ibis_model_name: undefined,
    }).kind,
  ).toBe("differential")
  expectInvalidChanges(signal, [
    { driver: endpoint },
    { receivers: [signal.driver, endpoint] },
    { driver: endpoint, receivers: [endpoint, signal.driver] },
  ])
})
