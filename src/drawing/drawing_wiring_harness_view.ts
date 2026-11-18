import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

export const drawing_wiring_harness_view = z
  .object({
    type: z.literal("drawing_wiring_harness_view"),
    drawing_wiring_harness_view_id: z.string().trim().min(1),
    drawing_page_id: z.string().min(1),
    cad_cable_id: z.string().min(1),
    name: z.string().optional(),
    display_name: z.string().optional(),
    center: z.object({ x: z.number().finite(), y: z.number().finite() }),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    scale: z.number().finite().positive().optional(),
  })
  .describe(
    "A flattened view of one cad_cable for cable manufacturing: from-end connector at paper left, to-end connector at paper right, wire exits facing each other, one line per cad_cable_wire. The cable lies flat and untwisted, so both connectors show the same face: from-end pin 1 is at paper top and to-end pin 1 at paper bottom. Connector designators, end pin numbers and the nominal length dimension are derived from the cable. Paper coordinates are mm, relative to the drawing page anchor, +X right/+Y up. scale applies to connector geometry only; the drawn cable span is schematic and never to scale. The cable's 3D path is not used.",
  )

export interface DrawingWiringHarnessView {
  type: "drawing_wiring_harness_view"
  drawing_wiring_harness_view_id: string
  drawing_page_id: string
  /** The cable to draw; its cad_cable_wire records supply the wires. */
  cad_cable_id: string
  name?: string
  display_name?: string
  center: { x: number; y: number }
  width: number
  height: number
  /** Connector model-to-paper ratio; omitted means fit. Cable length is never to scale. */
  scale?: number
}
export type DrawingWiringHarnessViewInput = z.input<
  typeof drawing_wiring_harness_view
>
expectTypesMatch<
  DrawingWiringHarnessView,
  z.infer<typeof drawing_wiring_harness_view>
>(true)
