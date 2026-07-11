import { expect, test } from "bun:test"
import { source_project_metadata } from "../src/source/source_project_metadata"

test("source_project_metadata accepts an optional source filesystem MD5 hash", () => {
  const metadataWithoutHash = source_project_metadata.parse({
    type: "source_project_metadata",
  })
  expect(metadataWithoutHash.source_filesystem_md5_hash).toBeUndefined()

  const metadataWithHash = source_project_metadata.parse({
    type: "source_project_metadata",
    source_filesystem_md5_hash: "d41d8cd98f00b204e9800998ecf8427e",
  })
  expect(metadataWithHash.source_filesystem_md5_hash).toBe(
    "d41d8cd98f00b204e9800998ecf8427e",
  )

  expect(
    source_project_metadata.safeParse({
      type: "source_project_metadata",
      source_filesystem_md5_hash: 123,
    }).success,
  ).toBeFalse()
})
