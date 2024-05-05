import { source_component_base } from "src/source/base/source_component_base"
import { z } from "zod"
import { inductance } from "../units"

const source_simple_inductor = source_component_base.extend({
  ftype: z.literal("simple_inductor"),
  inductance,
})

export type SourceSimpleInductor = z.infer<typeof source_simple_inductor>
export type SourceSimpleInductorInput = z.input<typeof source_simple_inductor>
