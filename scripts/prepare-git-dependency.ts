import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, relative, resolve, sep } from "node:path"

const sourceDirectory = resolve(import.meta.dir, "..")
const excludedTopLevelNames = new Set([".git", "dist", "node_modules"])
const isInstalledSourceDependency = sourceDirectory
  .split(sep)
  .includes("node_modules")

if (!isInstalledSourceDependency) process.exit(0)

function shouldCopyBuildSource(sourcePath: string): boolean {
  const topLevelName = relative(sourceDirectory, sourcePath).split(sep)[0]
  return !excludedTopLevelNames.has(topLevelName ?? "")
}

async function runCommand(
  command: string[],
  workingDirectory: string,
): Promise<void> {
  const buildProcess = Bun.spawn(command, {
    cwd: workingDirectory,
    stderr: "inherit",
    stdout: "pipe",
  })
  const [exitCode, commandOutput] = await Promise.all([
    buildProcess.exited,
    new Response(buildProcess.stdout).text(),
  ])
  if (commandOutput) await Bun.write(Bun.stderr, commandOutput)
  if (exitCode !== 0) {
    throw new Error(`${command[0]} exited with code ${exitCode}`)
  }
}

const buildDirectory = await mkdtemp(join(tmpdir(), "circuit-json-prepare-"))

try {
  await cp(sourceDirectory, buildDirectory, {
    filter: shouldCopyBuildSource,
    recursive: true,
  })
  await runCommand(["bun", "install", "--ignore-scripts"], buildDirectory)
  await runCommand(["bun", "run", "build"], buildDirectory)
  await rm(join(sourceDirectory, "dist"), { force: true, recursive: true })
  await cp(join(buildDirectory, "dist"), join(sourceDirectory, "dist"), {
    recursive: true,
  })
} finally {
  await rm(buildDirectory, { force: true, recursive: true })
}
