# Circuit JSON Specification: Source Error Overview

This document outlines the standard error and warning types emitted during logical (source) analysis of a circuit.

## `SourceI2cMisconfiguredError`
Emitted when an I2C bus is electrically shorted or incorrectly configured.

```ts
export interface SourceI2cMisconfiguredError {
  type: "source_i2c_misconfigured_error"
  source_i2c_misconfigured_error_id: string
  error_type: "source_i2c_misconfigured_error"
  message: string
  source_port_ids: string[]
}
```

## `SourcePinMustBeConnectedError`
Emitted when a pin marked with `must_be_connected: true` is not found in any net or trace.

```ts
export interface SourcePinMustBeConnectedError {
  type: "source_pin_must_be_connected_error"
  source_pin_must_be_connected_error_id: string
  error_type: "source_pin_must_be_connected_error"
  message: string
  source_port_id: string
}
```

## `SourceTraceNotConnectedError`
Emitted when a trace is defined but one or more of its endpoints are not connected to a physical component or net.

```ts
export interface SourceTraceNotConnectedError {
  type: "source_trace_not_connected_error"
  source_trace_not_connected_error_id: string
  error_type: "source_trace_not_connected_error"
  message: string
  source_trace_id: string
}
```

## `SourcePinMissingTraceWarning`
A warning emitted when a component pin is unconnected but not strictly required to be.

```ts
export interface SourcePinMissingTraceWarning {
  type: "source_pin_missing_trace_warning"
  source_pin_missing_trace_warning_id: string
  warning_type: "source_pin_missing_trace_warning"
  message: string
  source_port_id: string
}
```
