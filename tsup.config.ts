import path from "node:path"
import { defineConfig } from "tsup"

const projectDirectory = import.meta.dirname

export default defineConfig({
  entry: [path.join(projectDirectory, "src/index.ts")],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  outDir: path.join(projectDirectory, "dist"),
  tsconfig: path.join(projectDirectory, "tsconfig.json"),
  esbuildOptions(options) {
    options.alias = {
      src: path.join(projectDirectory, "src"),
    }
  },
})
