import { expect, test } from "bun:test"
import { pcb_differential_pair_local_skew } from "../src"
import {
  coupled_segment,
  skew,
} from "./fixtures/pcb-differential-pair-local-skew"

test("local skew rejects blank source bus and trace IDs", () => {
  for (const invalid of [
    { ...skew, source_bus_id: "" },
    { ...skew, source_bus_id: "  " },
    { ...skew, positive: { ...skew.positive, pcb_trace_id: "" } },
  ]) {
    expect(pcb_differential_pair_local_skew.safeParse(invalid).success).toBe(
      false,
    )
  }
})
