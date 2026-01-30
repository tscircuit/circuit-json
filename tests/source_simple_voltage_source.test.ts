import { test, expect } from "bun:test"
import { source_simple_voltage_source } from "../src/source/source_simple_voltage_source"

test("source_simple_voltage_source parse", () => {
    const source = source_simple_voltage_source.parse({
        type: "source_component",
        ftype: "simple_voltage_source",
        source_component_id: "source_id",
        name: "V1",
        voltage: "5V",
        frequency: "1kHz",
        peak_to_peak_voltage: "10V",
        wave_shape: "sinewave",
        phase: "90deg",
        duty_cycle: 0.5,
    })

    expect(source.ftype).toBe("simple_voltage_source")
    expect(source.voltage).toBe(5)
    expect(source.frequency).toBe(1000)
    expect(source.peak_to_peak_voltage).toBe(10)
    expect(source.wave_shape).toBe("sinewave")
    expect(source.phase).toBe(90)
    expect(source.duty_cycle).toBe(0.5)
})

test("source_simple_voltage_source parse with minimal properties", () => {
    const source = source_simple_voltage_source.parse({
        type: "source_component",
        ftype: "simple_voltage_source",
        source_component_id: "source_id",
        name: "V2",
        voltage: 3.3,
    })

    expect(source.ftype).toBe("simple_voltage_source")
    expect(source.voltage).toBe(3.3)
    expect(source.frequency).toBeUndefined()
    expect(source.peak_to_peak_voltage).toBeUndefined()
})
