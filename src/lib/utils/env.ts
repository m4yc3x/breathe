export function validateEnvVars(required: string[]) {
  const missing = required.filter(name => !process.env[name])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
} 