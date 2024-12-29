import { baseEmailTemplate } from './base'

interface PasswordResetEmailProps {
  username: string
  resetUrl: string
}

export function createPasswordResetEmail({ username, resetUrl }: PasswordResetEmailProps) {
  const html = baseEmailTemplate({
    title: 'Reset Your Password',
    content: `
      <h1>Hello ${username},</h1>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
        <tbody>
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td>
                      <a href="${resetUrl}" target="_blank">Reset Password</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <p>Or copy and paste this URL into your browser:</p>
      <p class="url-display">${resetUrl}</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p class="note">If you didn't request this password reset, you can safely ignore this email.</p>
    `,
  })

  const text = `
Hello ${username},

You requested to reset your password. Click the link below to set a new password:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email.
  `.trim()

  return {
    subject: 'Reset Your Password - CrackMe',
    html,
    text,
  }
} 