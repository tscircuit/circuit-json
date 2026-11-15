import { test } from "bun:test"
import {
  signal,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("measurement source fields are rejected", () => {
  expectInvalidChanges(
    signal,
    [
      "mask",
      "strobe_simulation_signal_id",
      "thresholds",
      "setup_s",
      "hold_s",
    ].map((field) => ({ [field]: "removed" })),
  )
})
