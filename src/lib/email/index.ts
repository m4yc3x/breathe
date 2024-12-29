import { smtp } from './smtp'
import { createPasswordResetEmail } from './templates/password-reset'

interface SendPasswordResetEmailParams {
  to: string
  resetToken: string
  username: string
}

export async function sendPasswordResetEmail({
  to,
  resetToken,
  username,
}: SendPasswordResetEmailParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined')
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`
  const email = createPasswordResetEmail({ username, resetUrl })

  await smtp.sendMail({
    to,
    ...email,
  })
}

export async function sendTwoFactorEmail({
  to,
  code,
  username,
  isDisabling = false,
  isLogin = false,
}: {
  to: string
  code: string
  username: string
  isDisabling?: boolean
  isLogin?: boolean
}) {
  const subject = isLogin 
    ? "Login Verification Code"
    : isDisabling 
      ? "Disable Two-Factor Authentication" 
      : "Two-Factor Authentication Setup"
  
  const html = `
    <h1>${isLogin ? 'Login Verification' : isDisabling ? 'Disable' : 'Setup'} Two-Factor Authentication</h1>
    <p>Hello ${username},</p>
    <p>Your verification code is: <strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    ${isLogin 
      ? '<p>Use this code to complete your login.</p>'
      : isDisabling 
        ? '<p>This code will be used to disable two-factor authentication on your account.</p>'
        : '<p>Use this code to complete your two-factor authentication setup.</p>'
    }
    <p>If you didn't request this code, please ignore this email.</p>
  `

  const text = `
    ${isLogin ? 'Login Verification' : isDisabling ? 'Disable' : 'Setup'} Two-Factor Authentication
    
    Hello ${username},
    
    Your verification code is: ${code}
    
    This code will expire in 10 minutes.
    
    ${isLogin 
      ? 'Use this code to complete your login.'
      : isDisabling 
        ? 'This code will be used to disable two-factor authentication on your account.'
        : 'Use this code to complete your two-factor authentication setup.'
    }
    
    If you didn't request this code, please ignore this email.
  `

  await smtp.sendMail({
    to,
    subject,
    html,
    text,
  })
} 