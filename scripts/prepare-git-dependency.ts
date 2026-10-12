import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

// Git dependencies need dist without a registry release. Build outside
// node_modules: bundlers do not apply our source path aliases there.
const packageRoot = process.cwd()
const buildRoot = await mkdtemp(join(tmpdir(), "circuit-json-build-"))
try {
  for (const path of ["src", "package.json", "bun.lock", "tsconfig.json"])
    await cp(join(packageRoot, path), join(buildRoot, path), {
      recursive: true,
    })
  for (const command of [
    ["install", "--frozen-lockfile", "--ignore-scripts"],
    ["run", "build"],
  ]) {
    const child = Bun.spawn([process.execPath, ...command], {
      cwd: buildRoot,
      stdout: "inherit",
      stderr: "inherit",
    })
    if ((await child.exited) !== 0)
      throw new Error(`Schema Git dependency ${command[0]} failed`)
  }
  await cp(join(buildRoot, "dist"), join(packageRoot, "dist"), {
    recursive: true,
  })
} finally {
  await rm(buildRoot, { recursive: true, force: true })
}
