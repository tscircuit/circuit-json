# Circuit JSON Specification `circuit-json`

[tscircuit](https://github.com/tscircuit/tscircuit) · [Soup Specification Docs](https://docs.tscircuit.com/api-reference/advanced/soup)

[![npm version](https://badge.fury.io/js/%40tscircuit%2Fsoup.svg)](https://badge.fury.io/js/%40tscircuit%2Fsoup)

Circuit JSON (formally “tscircuit soup”) is the name of the compiled intermediary low-level JSON circuit representation. It contains all the information needed to visually represent a schematic, PCB, produce Gerber files, produce bill of materials, run SPICE simulations, view warnings and more. It is designed to easily interoperate with a SQL database.

This module has the zod definitions and conversion functions for using tscircuit soup.

> [!INFO]
> This is mostly an internal module, you probably want to use the [main tscircuit library](https://github.com/tscircuit/tscircuit) instead.

```ts
import { any_circuit_element, simple_source_resistor } from "circuit-json"
import type { SourceSimpleResistor } from "circuit-json"

const resistor: SourceSimpleResistor = simple_source_resistor.parse({
  type: "source_component",
  ftype: "simple_resistor",
  source_component_id: "source_component_1",
  name: "R1",
  resistane: "1k",
})

console.log(resistor.resistance) // 1000

// This is the common way to parse/transform any element
any_circuit_element.parse({
  /* ... */
})
```
