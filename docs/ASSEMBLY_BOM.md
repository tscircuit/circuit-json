# Assembly BOM entries

`cad_assembly_bom_item` represents a material or subassembly in an assembly BOM.
It is a separate Circuit JSON element with its own stable identity:

```ts
{
  type: "cad_assembly_bom_item",
  cad_assembly_bom_item_id: "bom_screws",
  parent_cad_assembly_bom_item_id: "bom_housing",
  name: "M3 screws",
  quantity: 4,
  purchase_urls: ["https://www.amazon.com/dp/B000000001"],
}
```

`parent_cad_assembly_bom_item_id` refers to another BOM entry and enables nested,
collapsible subassemblies. An omitted parent means a root entry. Producers should
emit an acyclic hierarchy with existing parents; the per-record schema does not
resolve references or validate the complete hierarchy.

`quantity` is a required positive safe integer: the number of individual items
per parent assembly, or per root build when there is no parent. Four screws under
a housing with quantity two require eight screws for one root build. Quantity
does not create geometry and is not a pack size. Length-based materials are
outside this initial contract.

An optional `source_component_id` connects the entry to its authored component.
Optional `cad_component_ids` associate one or more geometry records with the
entry; geometry count does not determine quantity. Both references can be omitted
for unmodeled materials. Creating a BOM entry does not require a PCB footprint.

Existing `supplier_part_numbers` identifiers can support parts-engine lookups.
Optional `purchase_urls` contains direct HTTP(S) product listings at any stores,
including Amazon. Multiple URLs are purchasing options for the same BOM item;
they do not add quantities. Omission or an empty array means no product links.
Links do not imply automatic price support or a correspondence to any particular
supplier part number. Live price and stock quotes remain in the
parts engine or consuming UI.

Parentage expresses BOM structure only. This record does not define build/buy
modes, supplier-offer objects or price-rollup policy. Source component schemas
remain unchanged; assembly-specific quantities, links and nesting live here.

This schema provides the interchange format. TSX emission, converter and UI
integration are separate follow-ups. Consumers must avoid generating duplicate
BOM entries from a source component already represented by an explicit entry.
