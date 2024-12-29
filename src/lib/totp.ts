import { createHash, randomBytes } from "crypto"

export function generateTOTP() {
  // Generate a random secret
  const secret = randomBytes(20).toString('hex')
  
  // Generate a code using the current timestamp
  const timestamp = Date.now()
  const code = generateCode(secret, timestamp)
  
  return { secret, code, timestamp }
}

export function verifyTOTP(inputCode: string, secret: string): boolean {
  const currentTime = Date.now()
  
  // Check codes within the 10-minute window
  for (let i = 0; i < 10; i++) {
    const timestamp = currentTime - i * 60000 // Check each minute
    const validCode = generateCode(secret, timestamp)
    
    if (inputCode === validCode) {
      return true
    }
  }
  
  return false
}

function generateCode(secret: string, timestamp: number): string {
  // Use 1-minute time steps
  const timeStep = Math.floor(timestamp / 60000)
  
  const hmac = createHash('sha1')
    .update(`${secret}${timeStep}`)
    .digest('hex')
  
  // Generate a 6-digit code
  const offset = parseInt(hmac.slice(-1), 16)
  const code = parseInt(hmac.slice(offset, offset + 6), 16)
  return String(code % 1000000).padStart(6, '0')
} 