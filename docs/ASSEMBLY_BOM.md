# Assembly BOM metadata

Components can carry product links directly, including assembly materials without
PCB footprints:

```ts
{
  type: "source_component",
  ftype: "subassembly",
  source_component_id: "housing",
  name: "Housing",
  parent_source_component_id: "device",
  bom_quantity: 1,
  supplier_part_urls: ["https://www.amazon.com/dp/B000000001"],
}
```

`supplier_part_urls` is an optional array of complete HTTP(S) product listing
URLs. It accepts any supplier host, so adding an Amazon or specialist supplier
link does not require changing the supplier enum. URLs retain their query strings
and are independent of `supplier_part_numbers`; there is no positional mapping
between the two fields. Existing electronic supplier identifiers continue to use
`supplier_part_numbers` unchanged. Multiple URLs are links to purchasing options
for the same component, not additional BOM items.

`parent_source_component_id` preserves physical assembly membership separately
from electrical `source_group_id` and `subcircuit_id`. Producers should emit an
acyclic hierarchy with existing parents. Parentage is structural and does not
specify how an assembly should be purchased or how prices should be rolled up.

`bom_quantity` is a positive integer count per parent assembly, defaulting to one
in consumers. It does not create additional geometry. Fractional/length-based
materials are outside this initial contract.

All three fields are optional, and parsing old documents does not add defaults.
Prices and stock remain in the parts engine or consuming UI. A product URL does
not imply automatic pricing support. This API contains no purchasing modes,
pack sizes, or separate supplier-offer records.

This schema defines the interchange fields. TSX authoring and renderer emission
remain separate integrations.
