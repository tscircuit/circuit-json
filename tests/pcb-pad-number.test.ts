import { describe, expect, test } from "bun:test"
import { pcb_plated_hole, pcb_smtpad } from "src/pcb"

const smtShapes = [
  { shape: "circle", radius: 1 },
  { shape: "rect", width: 2, height: 1 },
  { shape: "rotated_rect", width: 2, height: 1, ccw_rotation: 30 },
  { shape: "pill", width: 2, height: 1, radius: 0.5 },
  { shape: "rotated_pill", width: 2, height: 1, radius: 0.5, ccw_rotation: 30 },
  {
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
  },
]
const platedShapes = [
  { shape: "circle", outer_diameter: 2, hole_diameter: 1 },
  ...["oval", "pill"].map((shape) => ({
    shape,
    outer_width: 3,
    outer_height: 2,
    hole_width: 2,
    hole_height: 1,
    ccw_rotation: 0,
  })),
  {
    shape: "circular_hole_with_rect_pad",
    hole_shape: "circle",
    pad_shape: "rect",
    hole_diameter: 1,
    rect_pad_width: 2,
    rect_pad_height: 2,
  },
  {
    shape: "pill_hole_with_rect_pad",
    hole_shape: "pill",
    pad_shape: "rect",
    hole_width: 2,
    hole_height: 1,
    rect_pad_width: 3,
    rect_pad_height: 2,
  },
  {
    shape: "rotated_pill_hole_with_rect_pad",
    hole_shape: "rotated_pill",
    pad_shape: "rect",
    hole_width: 2,
    hole_height: 1,
    hole_ccw_rotation: 30,
    rect_pad_width: 3,
    rect_pad_height: 2,
    rect_ccw_rotation: 30,
  },
  {
    shape: "hole_with_polygon_pad",
    hole_shape: "circle",
    hole_diameter: 1,
    pad_outline: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ],
  },
]

for (const { schema, fixtures } of [
  {
    schema: pcb_smtpad,
    fixtures: smtShapes.map((shape) => ({
      type: "pcb_smtpad",
      x: 0,
      y: 0,
      layer: "top",
      ...shape,
    })),
  },
  {
    schema: pcb_plated_hole,
    fixtures: platedShapes.map((shape) => ({
      type: "pcb_plated_hole",
      x: 0,
      y: 0,
      layers: ["top", "bottom"],
      ...shape,
    })),
  },
]) {
  for (const fixture of fixtures) {
    describe(`${fixture.type} ${fixture.shape} pad_number`, () => {
      for (const pad_number of [
        "A1",
        "B2",
        "MP1",
        "01",
        "",
        "a1",
        "A-1.2",
        "pinA1",
      ]) {
        test.failing(`preserves ${JSON.stringify(pad_number)} independently of port hints`, () => {
          const parsed = schema.parse({
            ...fixture,
            pad_number,
            port_hints: ["pin7", "GND"],
          })
          expect(parsed).toHaveProperty("pad_number", pad_number)
          expect(parsed.port_hints).toEqual(["pin7", "GND"])
        })
      }
      test("accepts legacy data without a pad number", () => {
        expect(schema.parse(fixture)).not.toHaveProperty("pad_number")
      })
      test.failing("rejects numeric pad numbers rather than coercing them", () => {
        expect(schema.safeParse({ ...fixture, pad_number: 1 }).success).toBe(
          false,
        )
      })
      test.failing("preserves repeated physical labels", () => {
        const pads = [fixture, fixture].map((pad) =>
          schema.parse({ ...pad, pad_number: "MP1" }),
        )
        expect(
          pads.map((pad) => (pad as { pad_number?: string }).pad_number),
        ).toEqual(["MP1", "MP1"])
      })
    })
  }
}
