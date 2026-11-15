import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  block,
  signal,
  waveform,
  rlgc,
} from "./fixtures/simulation-signal-integrity"

test.each([block, signal, waveform, rlgc])(
  "$type is exported, generates an ID, and survives the public union and JSON roundtrip",
  (record) => {
    const schema = circuitJson[record.type]
    const parsed = schema.parse(record)
    expect(parsed).toMatchObject(record)
    expect(Reflect.get(parsed, `${record.type}_id`)).toStartWith(
      `${record.type}_`,
    )
    expect(circuitJson.any_circuit_element.parse(parsed)).toEqual(parsed)
    expect(
      circuitJson.any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
    ).toEqual(parsed)
    for (const field of Object.keys(record).filter(
      (field) => field !== "name" && field !== "duration_s",
    )) {
      expect(schema.safeParse({ ...record, [field]: undefined }).success).toBe(
        false,
      )
    }
  },
)
