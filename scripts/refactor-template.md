Refactor the "${PATHNAME}" file to reflect the new style of defining elements
for the Circuit Json specification. Follow the new rules. Please output the
entire new file in a code block.

Some of the new rules:

- Export a snake_case zod object from the file
- Export a type or interface in `PascalCase` (with abbreviations considered single words)
- Use the `expectTypesMatch` function to ensure the zod type and interface are the same
- Mark old exports as deprecated
- Prefer absolute imports from "src/"
- Use `getZodPrefixedIdWithDefault` to generate a unique id for the primary id of the object
- The main interface should have a `/**` multi-line comment describing the object
- If the zod type is a union or `or` type, then it into separate zod types
  and export interfaces for each of the of the types in the union, then define a
  union type for each of the exported interfaces
  `export type MainInterface = SomeInterface1 | SomeInterface2`.

```ts
// EXAMPLE FILE OF NEW CIRCUIT SPECIFICATION
import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { rotation, length, type Rotation, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component = z
  .object({
    type: z.literal("pcb_component"),
    pcb_component_id: getZodPrefixedIdWithDefault("pcb_component"),
    source_component_id: z.string(),
    center: point,
    layer: layer_ref,
    rotation: rotation,
    width: length,
    height: length,
  })
  .describe("Defines a component on the PCB")

export type PCBComponentInput = z.input<typeof pcb_component>
type InferredPCBComponent = z.infer<typeof pcb_component>

/**
 * Defines a component on the PCB
 */
export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}

/**
 * @deprecated use PcbComponent
 */
export type PCBComponent = PcbComponent

expectTypesMatch<PcbComponent, InferredPCBComponent>(true)
```

Here is the file to refactor:

## ${PATHNAME}

```ts
${FILECONTENTS}
```
