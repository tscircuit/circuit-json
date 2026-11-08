import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_copper_text,
  pcb_fabrication_note_dimension,
  pcb_fabrication_note_rect,
  pcb_silkscreen_circle,
  pcb_silkscreen_graphic,
  pcb_silkscreen_line,
  pcb_silkscreen_oval,
  pcb_silkscreen_path,
  pcb_silkscreen_pill,
  pcb_silkscreen_rect,
} from "src"

test("silkscreen shapes, fabrication note rects/dimensions, and copper text can belong to a board or group without a component", () => {
  const cases = [
    {
      schema: pcb_silkscreen_rect,
      record: {
        type: "pcb_silkscreen_rect" as const,
        pcb_silkscreen_rect_id: "pcb_silkscreen_rect_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        center: { x: 0, y: 0 },
        width: 10,
        height: 5,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_silkscreen_circle,
      record: {
        type: "pcb_silkscreen_circle" as const,
        pcb_silkscreen_circle_id: "pcb_silkscreen_circle_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        center: { x: 1, y: 2 },
        radius: 3,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_silkscreen_line,
      record: {
        type: "pcb_silkscreen_line" as const,
        pcb_silkscreen_line_id: "pcb_silkscreen_line_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        x1: 0,
        y1: 0,
        x2: 5,
        y2: 5,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_silkscreen_path,
      record: {
        type: "pcb_silkscreen_path" as const,
        pcb_silkscreen_path_id: "pcb_silkscreen_path_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        layer: "top" as const,
        route: [
          { x: 0, y: 0 },
          { x: 2, y: 2 },
        ],
        stroke_width: 0.15,
      },
    },
    {
      schema: pcb_silkscreen_oval,
      record: {
        type: "pcb_silkscreen_oval" as const,
        pcb_silkscreen_oval_id: "pcb_silkscreen_oval_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        center: { x: 0, y: 0 },
        radius_x: 2,
        radius_y: 1,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_silkscreen_pill,
      record: {
        type: "pcb_silkscreen_pill" as const,
        pcb_silkscreen_pill_id: "pcb_silkscreen_pill_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        center: { x: 0, y: 0 },
        width: 4,
        height: 2,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_silkscreen_graphic,
      record: {
        type: "pcb_silkscreen_graphic" as const,
        pcb_silkscreen_graphic_id: "pcb_silkscreen_graphic_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        layer: "top" as const,
        shape: "brep" as const,
        brep_shape: {
          outer_ring: {
            vertices: [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 1, y: 1 },
            ],
          },
        },
      },
    },
    {
      schema: pcb_fabrication_note_rect,
      record: {
        type: "pcb_fabrication_note_rect" as const,
        pcb_fabrication_note_rect_id: "pcb_fabrication_note_rect_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        center: { x: 0, y: 0 },
        width: 8,
        height: 4,
        layer: "top" as const,
      },
    },
    {
      schema: pcb_fabrication_note_dimension,
      record: {
        type: "pcb_fabrication_note_dimension" as const,
        pcb_fabrication_note_dimension_id: "pcb_fabrication_note_dimension_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        layer: "top" as const,
        from: { x: 0, y: 0 },
        to: { x: 10, y: 0 },
      },
    },
    {
      schema: pcb_copper_text,
      record: {
        type: "pcb_copper_text" as const,
        pcb_copper_text_id: "pcb_copper_text_board",
        pcb_group_id: "pcb_group_board",
        subcircuit_id: "subcircuit_board",
        layer: "top" as const,
        text: "REV A",
        anchor_position: { x: 0, y: 0 },
      },
    },
  ]

  for (const { schema, record } of cases) {
    const parsed = schema.parse(record as never) as {
      pcb_component_id?: string
      pcb_group_id?: string
    }
    expect(parsed.pcb_component_id).toBeUndefined()
    expect(parsed.pcb_group_id).toBe("pcb_group_board")
    expect(any_circuit_element.safeParse(record).success).toBe(true)

    const withOwner = schema.parse({
      ...record,
      pcb_component_id: "pcb_component_1",
    } as never) as { pcb_component_id?: string }
    expect(withOwner.pcb_component_id).toBe("pcb_component_1")

    for (const pcb_component_id of [null, 42]) {
      expect(
        schema.safeParse({ ...record, pcb_component_id }).success,
      ).toBe(false)
    }
  }
})
