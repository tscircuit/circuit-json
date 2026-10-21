# Agent instructions

## Schema design

- Use snake_case for serialized properties, enum values, and schema exports; use PascalCase for public types. Follow existing terminology (`cad`, industry terms, and `_error`/`_warning` suffixes).
- Make names independently clear: include the unit, coordinate anchor, viewing direction, and referenced element where relevant. Avoid ambiguous `position`, `point_id`, or generic direction names. Do not add a qualified sibling while leaving the original name ambiguous.
- Store resolved, specific values. Reuse unit schemas and encode units explicitly where needed (e.g. `start_angle_degrees`, `current_rating_amps`). Flexible user input belongs in tscircuit/props; do not copy its permissive strings into this spec.
- Put each field on the element that owns it: source for logical data, schematic/PCB/CAD for representation. Relationship-specific display settings belong on the relationship, not on a reusable probe or component.
- Reuse existing elements, shared schemas, general warnings, and asset references. Extend the correct base schema (e.g. LED extends diode); do not add subtype-only properties to its base or store information already inferable from references.
- Prefer flat, separately identified records for independently addressable children. Keep value-only data nested when separate elements add no useful identity; normalization is not a blanket ban on nesting.
- Reference one concrete element type per ID field. Avoid polymorphic IDs and circular creation dependencies; verify every ID names a real element and every discriminator/ID prefix agrees.
- Preserve compatibility: prefer additive exports, aliases, and optional fields over renaming or making existing valid inputs fail. Explain unavoidable breaks and coordinate downstream consumers.
- Justify requiredness, defaults, and new variants with actual usage. Avoid magic defaults, speculative modes, redundant geometry, and unnecessary enums. Model distinct shapes explicitly when their fields differ; do not silently turn an existing unrotated shape into a rotated one.

## Implementation and verification

- Keep the Zod schema, explicit TypeScript interface, `expectTypesMatch` assertion, exports, and generated reference documentation in sync. Distinguish parsed output from `z.input` when defaults or transforms change the type.
- Preserve literal inference with `as const`; do not widen a precise constant to `Record<string, ...>` without a concrete need.
- For schema changes, test parsing through both the specific schema and `any_circuit_element`, including retained fields, invalid values, and compatibility where relevant. Each `*.test.ts` file may contain at most one `test(...)` call; split additional tests into numbered files.
- Use the existing Bun workflow: `bun install --frozen-lockfile`, `bun test`, `bunx tsc --noEmit`, `bun run lint:zod`, and `bun run check-snake-case`. For public schema changes, run `bun run generate-docs`, fix generation issues in the generator, and commit the generated diff.
- Keep documentation proportional: update the generated spec instead of adding an entire README section for a small field. Inspect the final diff for naming, IDs, missing fields, and unrelated changes before requesting review.
- Keep PRs focused, with a descriptive title and motivation. Prefer simplifying or deleting code when it solves the task; avoid `bun patch` when possible.
