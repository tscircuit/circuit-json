import path from "node:path"
import { defineConfig } from "tsup"

const projectDirectory =
  process.env.CIRCUIT_JSON_BUILD_ROOT ?? import.meta.dirname
const outputDirectory =
  process.env.CIRCUIT_JSON_BUILD_OUTPUT ?? path.join(projectDirectory, "dist")

export default defineConfig({
  entry: [path.join(projectDirectory, "src/index.ts")],
  format: ["esm"],
  external: ["format-si-unit", "zod"],
  dts: true,
  sourcemap: true,
  outDir: outputDirectory,
  tsconfig: path.join(projectDirectory, "tsconfig.json"),
  esbuildOptions(options) {
    options.alias = {
      src: path.join(projectDirectory, "src"),
    }
  },
})
