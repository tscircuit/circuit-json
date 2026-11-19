import { expect, test } from "bun:test"
import { source_project_metadata } from "../src/source/source_project_metadata"

const nativeProject = {
  url: "https://example.com/immutable/project.zip",
  sha256: "a".repeat(64),
  circuit_json_sha256: "b".repeat(64),
  project_file: "project/board.kicad_pro",
}

test("project metadata retains an optional native KiCad artifact", () => {
  const metadata = source_project_metadata.parse({
    type: "source_project_metadata",
    native_kicad_project: nativeProject,
  })
  expect(metadata.native_kicad_project).toEqual(nativeProject)
  expect(
    source_project_metadata.parse({ type: "source_project_metadata" })
      .native_kicad_project,
  ).toBeUndefined()
})

test("native KiCad artifacts reject incomplete or unsafe declarations", () => {
  for (const change of [
    { url: "not-a-url" },
    { url: "http://example.com/project.zip" },
    { url: "https://user:password@example.com/project.zip" },
    { sha256: "abcd" },
    { circuit_json_sha256: undefined },
    ...[
      "../board.kicad_pro",
      "/board.kicad_pro",
      "C:\\board.kicad_pro",
      "board.kicad_pcb",
      "project//board.kicad_pro",
    ].map((project_file) => ({ project_file })),
  ]) {
    expect(
      source_project_metadata.safeParse({
        type: "source_project_metadata",
        native_kicad_project: { ...nativeProject, ...change },
      }).success,
    ).toBeFalse()
  }
})

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
