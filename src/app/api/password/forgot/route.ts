import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const result = forgotPasswordSchema.safeParse(json)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists, you will receive a password reset email"
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expires: resetTokenExpiry,
      },
    })

    // Send email
    await sendPasswordResetEmail({
      to: user.email!,
      resetToken,
      username: user.name || user.email!,
    })

    return NextResponse.json({
      message: "If an account exists, you will receive a password reset email"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    )
  }
} 