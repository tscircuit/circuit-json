export interface SourceSoftware {
  userAgent: string
  tscircuitCoreVersion: string
  generatedAt: string
}

export function createSourceSoftware(
  tscircuitCoreVersion: string,
): SourceSoftware {
  return {
    userAgent: `tscircuit/${tscircuitCoreVersion}`,
    tscircuitCoreVersion,
    generatedAt: new Date().toISOString(),
  }
}
