import { test, expect } from "bun:test"
import { source_i2c_misconfigured_error } from "src/source/source_i2c_misconfigured_error"

test("source_i2c_misconfigured_error schema is defined", () => {
  expect(source_i2c_misconfigured_error).toBeDefined()
  expect(typeof source_i2c_misconfigured_error).toBe("object")
})
