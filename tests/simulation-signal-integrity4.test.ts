import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import { signal, endpoint } from "./fixtures/simulation-signal-integrity"

test.each(
  [
    "selector",
    [],
    [signal.driver, signal.driver],
    {},
    { source_port_id: "" },
    { source_port_id: "port", ibis_model_name: "" },
    { p_source_port_id: "p" },
    { n_source_port_id: "n" },
    { ...endpoint, p_source_port_id: "" },
    { ...endpoint, n_source_port_id: "" },
    { ...endpoint, n_source_port_id: endpoint.p_source_port_id },
    { ...endpoint, ibis_model_name: "BUS" },
    { ...endpoint, p_ibis_model_name: "" },
    { ...endpoint, n_ibis_model_name: "" },
    { ...signal.driver, p_source_port_id: "p", n_source_port_id: "n" },
    { ...signal.driver, p_ibis_model_name: "BUS" },
    { ...endpoint, kind: "differential" },
  ].map((invalid) => ({ invalid })),
)("rejects invalid endpoint $invalid", ({ invalid }) => {
  expect(circuitJson.signal_endpoint.safeParse(invalid).success).toBe(false)
})
