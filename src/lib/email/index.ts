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