import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

const pin_number = z.number().int().positive().safe()

export const cad_cable_wire = z
  .object({
    type: z.literal("cad_cable_wire"),
    cad_cable_wire_id: z.string().min(1),
    cad_cable_id: z.string().min(1),
    from_pin_number: pin_number,
    to_pin_number: pin_number,
    color: z.string().trim().min(1).optional(),
    wire_awg: z.number().finite().nonnegative().optional(),
    name: z.string().trim().min(1).optional(),
  })
  .describe(
    "One insulated conductor of a cad_cable, joining one contact at each end. Pin numbers are 1-based contact positions on the cable's own connectors, counted from each connector's pin 1 side. A cable with wire records is populated only where a wire lands, so connector contact counts may differ between ends and cavities may be empty. Consumers validate that pins exist on the cable's connectors and are used at most once per end.",
  )

/** One conductor of a cable. Unlisted connector cavities are unpopulated. */
export interface CadCableWire {
  type: "cad_cable_wire"
  cad_cable_wire_id: string
  cad_cable_id: string
  /** 1-based contact position on the cable's from-end connector. */
  from_pin_number: number
  /** 1-based contact position on the cable's to-end connector. */
  to_pin_number: number
  /** Insulation color name as it should read on a drawing, e.g. "black" or "red/white". */
  color?: string
  /** Conductor size, American Wire Gauge. */
  wire_awg?: number
  /** Optional signal or conductor name, e.g. "A+". */
  name?: string
}

export type CadCableWireInput = z.input<typeof cad_cable_wire>
expectTypesMatch<CadCableWire, z.infer<typeof cad_cable_wire>>(true)
