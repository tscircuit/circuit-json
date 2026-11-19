# AGENTS.md — circuit-json

The low-level data format every tscircuit package speaks. Everything here is
zod schemas plus their inferred TypeScript types; there is no runtime logic to
speak of, which is exactly why naming and validation rules matter so much — a
name chosen here propagates into every consumer and every stored artifact.

## Commands

```bash
bun install
bun test
bunx tsc --noEmit
bun run lint:zod           # snake_case enforcement on zod ENUM VALUES
bun run check-snake-case   # a different, weaker check on property names
```

CI runs all five on a pull request. `lint:zod` is the one people miss: it is
`scripts/zod-lint.ts`, and passing `check-snake-case` does **not** imply passing
it. A new enum member must be `from_y_pos`, never `from_y+`.

## Direction names

The authoritative definition — and the reasoning — lives in the docstring of
`src/pcb/properties/insertion_direction.ts`. Read it before touching anything
that names a side. In brief:

| Axis | Name | `insertion_direction` |
| --- | --- | --- |
| +X | `right` | `from_right` |
| −X | `left` | `from_left` |
| +Y | `top` | `from_top` |
| −Y | `bottom` | `from_bottom` |
| +Z | `above` | `from_above` |
| −Z | `below` | `from_below` |

A direction name states **where something is**, in board/project space — not
which way it travels. A receptacle on the +Y edge is `from_top` because that is
the side the plug comes from, even though the plug moves in −Y as it seats.

Cartesian spellings (`from_y_pos`, …) are accepted **as input** and normalized
by `insertionDirectionToCanonical`, so a parsed `insertion_direction` is always
one of the six named values. Emit only those.

**`front` and `back` are retired.** They meant opposite axes in different parts
of the ecosystem — `3d-viewer`'s `Front` camera preset is −Y, while `core`,
`checks` and `circuit-json-to-gltf` treated front as +Y — and that disagreement
caused most of the defects in this area. Do not reintroduce them in schemas,
enum values, comments or docs. Prefer naming the axis outright ("the +X face")
wherever a sentence can carry it: a named direction is a convenience, the axis
is the truth.

## The layer/direction collision

`top` and `bottom` name **different axes** depending on which field owns them:

| Owner | `top` | `bottom` |
| --- | --- | --- |
| direction / `insertion_direction` | **+Y** | **−Y** |
| **PCB layer** (`layer`) | **+Z** | **−Z** |

A layer is a Z concept; a direction is a Y concept. They are unrelated
quantities that happen to share two words. Any new field named `top` or
`bottom` must say in its docstring which of the two it is — and if the field
describes a face rather than a layer or a side, use the Cartesian spelling
(`x_pos`, `y_neg`, `z_pos`, …) so the question cannot arise. That spelling also
satisfies `lint:zod`, which `+`/`-` forms do not.

## Adding or changing a schema

- Snake_case everywhere in the data: property names and enum values.
- State units in the docstring. Millimetres throughout tscircuit.
- For anything geometric, say **which frame** the value is in, whether it is a
  point or a direction (a point picks up translation, a direction must not), and
  which way is up.
- Changing an existing field is a breaking change for every consumer in the
  ecosystem; prefer adding a field and deprecating the old one.
