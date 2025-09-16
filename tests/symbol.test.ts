import { describe, it, expect } from "bun:test"
import { schematic_symbol } from "../src/schematic/schematic_symbol"
import { schematic_component } from "../src/schematic/schematic_component"

describe("schematic_symbol", () => {
  it("parses a simple inline symbol", () => {
    const parsed = schematic_symbol.parse({
      width: 30,
      height: 10,
      primitives: [
        { kind: "line", x1: 0, y1: 5, x2: 12, y2: 5 },
        { kind: "rect", x: 12, y: 1, width: 6, height: 8 },
        { kind: "circle", cx: 15, cy: 5, r: 0.5, filled: true },
        { kind: "arc", cx: 22, cy: 5, r: 3, start_deg: -90, end_deg: 90 },
        { kind: "text", x: 2, y: 9.5, text: "R", font_size: 2 },
      ],
    })
    expect(parsed.primitives.length).toBe(5)
  })
})

describe("schematic_component + symbol fields", () => {
  it("accepts inline symbol", () => {
    const sc = schematic_component.parse({
      // ...minimum required existing fields for this schema in your repo...
      type: "schematic_component",
      schematic_component_id: "schematic_component_1",
      source_component_id: "source_component_1",
      center: { x: 0, y: 0 },
      rotation: 0,
      size: { width: 10, height: 5 },
      symbol: {
        primitives: [{ kind: "line", x1: 0, y1: 0, x2: 1, y2: 0 }],
      },
    })
    expect(sc.symbol?.primitives?.length).toBe(1)
  })

  it("accepts symbol_name alias", () => {
    const sc = schematic_component.parse({
      // ...minimum required existing fields...
      type: "schematic_component",
      schematic_component_id: "schematic_component_2",
      source_component_id: "source_component_1",
      center: { x: 0, y: 0 },
      rotation: 0,
      size: { width: 10, height: 5 },
      symbol_name: "resistor",
    })
    expect(sc.symbol_name).toBe("resistor")
  })
})
