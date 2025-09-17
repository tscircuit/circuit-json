
import { describe, it, expect } from "bun:test";
// Use the zod schemas for primitives (e.g., schematic_line) already in the repo.
import { schematic_line } from "../src/schematic/schematic_line";

describe("schematic primitives link to component", () => {
  it("line carries schematic_component_id", () => {
    const parsed = schematic_line.parse({
      type: "schematic_line",
      schematic_line_id: "schematic_line_1",
      schematic_component_id: "schematic_component_1",
      x1: 0, y1: 0, x2: 10, y2: 0,
      color: "black",
      is_dashed: false,
    });
    expect(parsed.schematic_component_id).toBe("schematic_component_1");
  });
});
