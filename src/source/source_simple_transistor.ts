import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { voltage, current } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  schematic_port,
  type SchematicPort,
} from "src/schematic/schematic_port"

export const source_simple_transistor = source_component_base.extend({
  ftype: z.literal("simple_transistor"),
  transistortype: z.enum(["npn", "pnp"]),
  schematic_ports: z.object({
    collector: schematic_port,
    base: schematic_port,
    emitter: schematic_port,
  }),
  collectorEmitterVoltage: voltage.optional(),
  baseEmitterVoltage: voltage.optional(),
  collectorCurrent: current.optional(),
})

export type SourceSimpleTransistorInput = z.input<
  typeof source_simple_transistor
>
type InferredSourceSimpleTransistor = z.infer<typeof source_simple_transistor>

/**
 * Defines a simple transistor component
 * This is a three-pin semiconductor device (emitter, base, collector)
 * Pin configuration is handled by the schematic port system
 */

export interface SourceSimpleTransistor extends SourceComponentBase {
  ftype: "simple_transistor"
  transistortype: "npn" | "pnp"
  schematic_ports: {
    collector: SchematicPort
    base: SchematicPort
    emitter: SchematicPort
  }
  collectorEmitterVoltage?: number
  baseEmitterVoltage?: number
  collectorCurrent?: number
}

expectTypesMatch<SourceSimpleTransistor, InferredSourceSimpleTransistor>(true)
