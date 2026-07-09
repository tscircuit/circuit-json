Contributing to Circuit JSON
Thank you for your interest in contributing to circuit-json! This document explains
how the project is structured, how to add or modify element definitions, and how to
submit high-quality pull requests.

Table of Contents

Project Overview
Repository Structure
Setting Up Locally
Understanding Circuit Elements
Adding a New Element Type
Modifying an Existing Element
Writing Tests
Submitting a Pull Request
Code Style
Getting Help


Project Overview
circuit-json is the canonical low-level data format for the tscircuit ecosystem.
Every tscircuit component ultimately compiles down to a Circuit JSON array. Downstream
tools — Gerber exporters, SPICE simulators, PCB viewers, autorouters — all consume
this format.
Because so many tools depend on it, changes to element schemas are taken seriously.
New fields should be optional (with sensible defaults), and existing required fields
should never be removed without a deprecation cycle.

Repository Structure
circuit-json/
├── src/
│   ├── pcb/          # PCB-layer element definitions (pcb_component, pcb_trace, …)
│   ├── schematic/    # Schematic-layer definitions (schematic_component, …)
│   ├── source/       # Source (logical) definitions (source_component, source_port, …)
│   ├── simulation/   # Simulation element definitions
│   └── index.ts      # Re-exports everything; the public API
├── docs/             # Auto-generated and hand-written documentation
├── tests/            # Vitest test suite
├── scripts/          # Code-generation helpers
└── README.md
The three main namespaces map directly to the three layers of a circuit:
NamespacePurposeExample elementssource_Logical / schematic intentsource_component, source_port, source_netschematic_Visual schematic representationschematic_component, schematic_tracepcb_Physical PCB representationpcb_component, pcb_trace, pcb_pad

Setting Up Locally
Prerequisites: Bun ≥ 1.0
bash# 1. Fork and clone the repo
git clone https://github.com/YOUR-USERNAME/circuit-json.git
cd circuit-json

# 2. Install dependencies
bun install

# 3. Run the test suite to confirm everything passes
bun test

# 4. (Optional) Build the package
bun run build

Understanding Circuit Elements
Every element is defined using Zod schemas. A typical element file
looks like this:
typescript// src/pcb/pcb_via.ts
import { z } from "zod"
import { point } from "../common/point"
import { length } from "../common/length"
import { layer_ref } from "../common/layer_ref"

export const pcb_via = z.object({
  type: z.literal("pcb_via"),
  pcb_via_id: z.string(),
  pcb_component_id: z.string().optional(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: length,
  y: length,
  outer_diameter: length,
  hole_diameter: length,
  layers: z.array(layer_ref),
})

export type PcbVia = z.infer<typeof pcb_via>
Key conventions:

type is always a z.literal(...) matching the snake_case element name.
*_id fields are always z.string(). The primary ID (pcb_via_id) is required;
relational IDs (pcb_component_id) are usually optional.
subcircuit_id and pcb_group_id are present on almost every PCB element —
add them unless there is a strong reason not to.
Lengths use the shared length Zod type, which accepts both numbers (base units = mm)
and strings like "1.5mm" or "100mil".


Adding a New Element Type
1. Create the source file
Place it in the correct namespace directory:
bash# Example: adding a new PCB element
touch src/pcb/pcb_my_element.ts
Define the Zod schema following the conventions above. Copy an existing file as a
template to ensure you don't miss standard fields.
2. Export from the namespace index
Open src/pcb/index.ts (or src/schematic/index.ts / src/source/index.ts) and add:
typescriptexport * from "./pcb_my_element"
3. Add to any_circuit_element
Open src/index.ts and add your new type to the any_circuit_element union:
typescriptexport const any_circuit_element = z.discriminatedUnion("type", [
  // … existing types …
  pcb_my_element,
])
4. Write at least one test
See Writing Tests below.
5. Update the README
The README contains a hand-maintained element catalogue. Add your element to the
appropriate section with its TypeScript interface and a one-line description.

Modifying an Existing Element

Adding an optional field: safe — add with .optional() and a sensible default.
Making an optional field required: breaking change — discuss in an issue first.
Removing a field: breaking change — open an issue and propose a deprecation path.
Renaming a field: breaking change — open an issue.

When in doubt, open an issue before writing code. This keeps PRs focused and avoids
wasted effort.

Writing Tests
Tests live in tests/ and use Vitest.
typescript// tests/pcb/pcb_my_element.test.ts
import { describe, it, expect } from "vitest"
import { pcb_my_element } from "../../src/pcb/pcb_my_element"

describe("pcb_my_element", () => {
  it("parses a valid element", () => {
    const result = pcb_my_element.parse({
      type: "pcb_my_element",
      pcb_my_element_id: "my_element_1",
      x: 0,
      y: 0,
    })
    expect(result.type).toBe("pcb_my_element")
  })

  it("accepts string lengths", () => {
    const result = pcb_my_element.parse({
      type: "pcb_my_element",
      pcb_my_element_id: "my_element_1",
      x: "1.5mm",
      y: "2mm",
    })
    expect(result.x).toBeCloseTo(1.5)
  })

  it("rejects missing required fields", () => {
    expect(() =>
      pcb_my_element.parse({ type: "pcb_my_element" })
    ).toThrow()
  })
})
Run the full suite before submitting:
bashbun test

Submitting a Pull Request

Branch from main

bash   git checkout -b feat/add-pcb-my-element

Make your changes following the guidelines above.
Run tests and linting

bash   bun test
   bun run lint   # uses Biome

Write a clear PR title using conventional commit style:

feat: add pcb_my_element type
fix: make pcb_via.layers optional
docs: add CONTRIBUTING guide


Reference the issue in your PR description:

   Closes #136

Keep PRs small and focused — one element or one fix per PR. This makes
review much faster.
Open the PR against tscircuit/circuit-json:main.


Code Style
This project uses Biome for formatting and linting.
bash# Format all files
bun run format

# Lint all files
bun run lint

# Fix auto-fixable lint issues
bun run lint:fix
Key style points:

Single quotes for strings.
No semicolons.
2-space indentation.
snake_case for all Circuit JSON field names (matching JSON convention).
PascalCase for exported TypeScript types (PcbVia, SchematicComponent, …).


Getting Help

Discord: tscircuit.com/join — the fastest way
to get a response. Mention you are working on circuit-json.
GitHub Issues: open an issue if you find a bug or want to propose a new element.
GitHub Discussions: for broader design questions.

We review PRs regularly and aim to respond within a few days. Thank you for
helping make Circuit JSON better!
