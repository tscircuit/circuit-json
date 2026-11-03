# Assembly BOM metadata

Source components may describe purchasing requirements without a PCB footprint.
`bom_sources` stores product URLs (including Amazon and other arbitrary suppliers)
and/or supplier part numbers. These are alternative purchasing options, not
additional materials. Existing `supplier_part_numbers` remains supported.

`parent_source_component_id` preserves physical assembly membership separately
from `source_group_id` and `subcircuit_id`. Producers should emit an acyclic tree
with existing parents. Consumers must detect cycles and tolerate missing parents.

`bom_quantity` is a positive integer count per parent assembly, defaulting to one
in consumers. Descendant quantities multiply through their ancestors. It does not
create additional geometry. `pack_quantity` is the number of individual items in
a purchasable pack, also defaulting to one. Fractional/length-based materials are
outside this initial contract.

`bom_assembly_mode: "build"` identifies a physical assembly whose material cost is
the sum of its children. `"buy"` identifies a complete purchased assembly: its
children may be inspected, but must not also contribute to purchasing totals.
Without a mode, consumers may treat a component with physical children as a built
assembly, and a leaf as a purchased item. Electrical groups alone do not imply a
physical purchasing boundary.

Prices and stock are deliberately absent. Live quotes belong to the consuming
parts engine/UI, with their currency, quantity basis and lookup time. A URL alone
does not imply that automatic pricing is available.

All fields are optional, so old documents retain their exact parsed shape. This
schema establishes the interchange contract; TSX authoring and renderer emission
are separate integrations.
