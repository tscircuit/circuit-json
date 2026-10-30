# Optional native KiCad project artifact

`source_project_metadata.native_kicad_project` advertises a complete native KiCad ZIP when a package already supplies one. It is optional; consumers can continue converting Circuit JSON when it is absent. It does not attest that the board is electrically safe or manufacturing approved.

- `url`: HTTPS download URL without embedded credentials. Prefer an immutable revision. Browser consumers need CORS access.
- `sha256`: lowercase SHA-256 of the exact ZIP bytes, before decompression.
- `project_file`: relative ZIP member path of the `.kicad_pro` entrypoint. Include the corresponding PCB, root schematic and every referenced child schematic in the archive.
- `circuit_json_sha256`: lowercase SHA-256 of the UTF-8 canonical circuit text defined below. This prevents a native project being used with another revision of the viewer data.

To produce the canonical text, remove `native_kicad_project` and `source_filesystem_md5_hash` only from `source_project_metadata` records. Recursively rebuild JSON objects using keys sorted by JavaScript's default `Array.sort()`, preserving array order and values. Serialize the result using `JSON.stringify` without a replacer, indentation or trailing newline. The filesystem hash is a CLI cache key; all other circuit fields participate in the binding. This algorithm applies to JSON-compatible values, not arbitrary JavaScript objects.

Consumers must reject multiple declarations, malformed paths, stale circuit hashes, unsuccessful downloads, corrupt ZIPs, SHA mismatches and incomplete projects. A failure in an advertised artifact must not silently fall back to conversion: that could deliver a different circuit without the user's knowledge. Consumers should fetch without credentials and return the original ZIP bytes unchanged.

The publisher must separately validate the source-to-native relationship, all archive members and applicable design rules before publishing a descriptor. Checksums establish identity and integrity, not design correctness or publisher trust.
