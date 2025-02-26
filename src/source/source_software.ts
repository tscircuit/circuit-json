export interface SourceSoftware {
  user_agent: string
  tscircuit_core_version: string
  generated_at: string
}

export function createSourceSoftware(
  tscircuit_core_version: string,
): SourceSoftware {
  return {
    user_agent: `tscircuit/${tscircuit_core_version}`,
    tscircuit_core_version,
    generated_at: new Date().toISOString(),
  }
}
