import { ResetPasswordForm } from "@/components/ResetPasswordForm"
import { validateResetToken } from "@/lib/auth"

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {

  const {token} = await params
  const isValid = await validateResetToken(token)

  if (!isValid) {
    return (
      <div className="container max-w-lg mx-auto mt-8 px-4">
        <div className="bg-destructive/10 text-destructive rounded-lg p-4">
          <h1 className="text-lg font-semibold">Invalid or Expired Link</h1>
          <p>This password reset link is invalid or has expired. Please request a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto mt-8 px-4">
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Reset Your Password</h1>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
} 