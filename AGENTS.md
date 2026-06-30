# Repository Guidance

This repository defines the Circuit JSON specification with TypeScript interfaces and Zod schemas. Changes here become part of the interchange format used across tscircuit packages, so schema additions must be precise, stable, and domain-neutral.

The review guidance below is synthesized from the latest 50 `tscircuit/circuit-json` pull requests where `seveibar` requested changes. Treat these as standing expectations for future work in this repository.

## Essential Commands

- `bun run build` - build the package with `tsup-node` and generate declarations
- `bun run format` - format the repository with Biome
- `bun run generate-docs` - regenerate README documentation from source schemas
- `bun run lint:zod` - run Zod/schema lint checks
- `bun run check-snake-case` - verify Circuit JSON naming conventions
- `bun test` - run tests with Bun
- `bunx tsc --noEmit` - typecheck without emitting files

## Core Principles

### Circuit JSON Is A Precise Spec

- Do not accept ambiguous user-facing strings for numeric schema values. Prefer explicit numeric units such as `_volts`, `_amps`, `_ms`, or well-defined unit schemas like `frequency`, `resistance`, and `capacitance`.
- Circuit JSON should be stricter and less forgiving than props APIs. Props can accept ergonomic input; Circuit JSON should store normalized, exact data.
- Make units clear in property names when a value is a raw number. Avoid names such as `time`, `value`, `color`, or `stroke` when a more explicit schema shape is needed.
- Use enums when the set of values will expand over time. Enum values should be lowercase unless an external format requires otherwise.

### Put Data On The Correct Element

- Add fields to the element that owns the concept. Do not put CAD display fields on `source_component`, schematic display fields on source elements, graph/probe relationship fields directly on probes, or source errors under PCB errors.
- Keep the Circuit JSON spec domain-neutral. Avoid tscircuit-specific names like `parts_engine` when a generic concept such as `error_finding_part` is intended.
- Do not add elements just because an application or props API has a concept. Some props transform board contents and should not appear in Circuit JSON.
- Reuse existing schema concepts when possible. If a schematic group is drawn as a component, model it through the existing `schematic_component` path instead of adding parallel rendering requirements.

### Naming Rules

- Use `snake_case` for Circuit JSON fields, filenames, exports, and enum values. Run `bun run check-snake-case` for schema changes.
- Do not abbreviate names unless the abbreviation is standard in electronics. Prefer `push_button` over `pushbutton`, `wavelength` over split or misspelled forms, and clear names over terse ones.
- Property names should describe what the data means from the reader's point of view. For mirrored text, distinguish viewing direction if that changes interpretation.
- Avoid independently ambiguous prefixes. If one field has a prefix, related fields should not be left unprefixed in a way that makes pairings unclear.
- Keep shape names consistent across objects. The meaning of `shape`, `rect`, `pill`, `circular_hole_with_rect_pad`, and related pad/hole names should not change by element.

### Schema Design Patterns

- Prefer `z.union` or `z.discriminatedUnion` for schema alternatives when that better represents the possible shapes.
- Define TypeScript interfaces alongside Zod schemas where the repository pattern expects them, and use `expectTypesMatch` for type/schema agreement.
- Avoid redundant fields.
- Preserve compatibility when renaming common units or helpers. Export aliases when existing consumers may depend on old names.

### Errors And Warnings

- Choose the correct domain for error elements: source errors belong under source, PCB errors under PCB, schematic warnings under schematic, and so on.
- Do not introduce deprecated fields in new schema.
- Error schemas should include useful identifiers such as `source_component_id` or `property_name` when that helps consumers locate the issue.

### Generated Documentation

- README schema tables are generated. Do not manually patch generated sections.
- After schema or description changes, run `bun run generate-docs` and include the generated README updates.
- Generated docs should describe the spec, not reflect on the package implementation or read package metadata.
- PR titles and docs should clearly name the element being added or changed. Avoid vague titles like "introduce element" or titles with missing element names.

### PR Hygiene

- Keep PRs focused on the element or behavior being changed. Do not modify unrelated schemas, such as changing capacitor files while adding resonator support.
- Include package scripts when adding a new lint or validation command.
- Do not add runtime checks that degrade performance when the type system or schema validation can express the constraint.

## Repository Structure

- Source, schematic, PCB, CAD, simulation, and error elements are organized under `src/` by domain. Keep new schemas in the matching domain directory.
- Export new element schemas and types through the appropriate `index.ts` files and aggregate union files such as `any_circuit_element.ts`.
