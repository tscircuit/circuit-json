#!/usr/bin/env bun
/**
 * Run the Pydantic types generator
 */

import { SimplePydanticGenerator } from "./generate-pydantic-types"

async function main() {
  console.log("Running Circuit JSON to Pydantic types generator...")

  try {
    const generator = new SimplePydanticGenerator()
    await generator.generate()

    console.log("Pydantic types generation completed successfully!")
    console.log("Generated files are in the 'python/' directory")

    console.log("\nGenerated structure:")
    console.log("  python/")
    console.log("  ├── __init__.py")
    console.log("  ├── base/")
    console.log("  │   ├── __init__.py")
    console.log("  │   └── utils.py")
    console.log("  ├── source/")
    console.log("  │   ├── __init__.py")
    console.log("  │   └── types.py")
    console.log("  ├── pcb/")
    console.log("  │   ├── __init__.py")
    console.log("  │   └── types.py")
    console.log("  ├── schematic/")
    console.log("  │   ├── __init__.py")
    console.log("  │   └── types.py")
    console.log("  ├── simulation/")
    console.log("  │   ├── __init__.py")
    console.log("  │   └── types.py")
    console.log("  └── cad/")
    console.log("      ├── __init__.py")
    console.log("      └── types.py")

    console.log("\nYou can now use the Pydantic types in Python:")
    console.log("  pip install pydantic")
    console.log("  from python import PcbComponent, SourceSimpleResistor")
  } catch (error) {
    console.error("Error generating Pydantic types:", error)
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}
