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

1. Every element type must have a primary id field named exactly `${type}_id`. For `type: "pcb_trace"`, the primary id is `pcb_trace_id`; for `type: "source_project_metadata"`, it is `source_project_metadata_id`. Do not invent shorter primary ids.
2. Reference fields must end in `_id` or `_ids` and include the referenced element type. Use `source_component_id`, `pcb_component_id`, `connected_source_port_ids`, or `simulation_voltage_probe_id`, not generic names like `component`, `component_id`, `probe`, or `ids`.
3. Use `snake_case` for Circuit JSON fields, filenames, exports, element `type` literals, and enum values. Run `bun run check-snake-case` for schema changes.
4. Do not abbreviate names unless the abbreviation is standard in electronics. Prefer `source_simple_push_button` over `pushbutton`, `frequency` over unclear short forms, and `wavelength` as one word.
5. Put units in numeric property names when the schema stores a raw number. Use names like `duration_ms`, `voltage_rating_volts`, `current_rating_amps`, and `stroke_width`; do not use vague names like `time`, `value`, `rating`, or `stroke`.
6. Use domain prefixes consistently. A source concept should start with `source_`, PCB with `pcb_`, schematic with `schematic_`, CAD with `cad_`, and simulation with `simulation_`. Error and warning element names should also include their domain.
7. Avoid independently ambiguous prefixes. Do not name related fields so that one has a clarifying prefix and the other does not. For directional relationships, use paired names like `from_source_port_id` and `to_source_port_id`.
8. Name relationship objects after the relationship, not either endpoint. If a field describes how a probe appears on a graph, prefer a relationship element such as `simulation_transient_graph_probe_display` instead of putting graph display fields directly on the probe.
9. Keep shape names consistent across element types. `shape`, `rect`, `pill`, `circular_hole_with_rect_pad`, `rect_pad_width`, `rect_pad_height`, and `pad_shape` should mean the same thing wherever they appear.
10. Boolean names must state the viewing frame or condition when interpretation depends on perspective. Prefer explicit names such as `is_mirrored_when_viewed_from_top` over `is_mirrored` when the shorter name can be read multiple ways.

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
