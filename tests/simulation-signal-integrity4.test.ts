import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import { signal, endpoint } from "./fixtures/simulation-signal-integrity"

test.each(
  [
    "selector",
    [],
    [signal.driver, signal.driver],
    { kind: "single", source_port_id: "" },
    { kind: "single", source_port_id: "port", ibis_model_name: "" },
    { kind: "differential", p_source_port_id: "p" },
    { ...endpoint, n_source_port_id: "" },
    { ...endpoint, n_source_port_id: endpoint.p_source_port_id },
    { ...endpoint, ibis_model_name: "BUS" },
    { ...endpoint, p_ibis_model_name: "" },
    { ...endpoint, n_ibis_model_name: "" },
    { ...signal.driver, p_source_port_id: "p", n_source_port_id: "n" },
    { ...endpoint, kind: "pair" },
  ].map((invalid) => ({ invalid })),
)("rejects invalid endpoint $invalid", ({ invalid }) => {
  expect(circuitJson.signal_endpoint.safeParse(invalid).success).toBe(false)
})
