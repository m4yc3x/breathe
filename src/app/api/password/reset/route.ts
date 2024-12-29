import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { hash } from "argon2"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const result = resetPasswordSchema.safeParse(json)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    const { password, token } = result.data

    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find valid token
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    })

    if (!passwordReset) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Update password with Argon2
    const hashedPassword = await hash(password)
    await prisma.user.update({
      where: {
        id: passwordReset.userId,
      },
      data: {
        hashedPassword,
      },
    })

    // Delete all reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: {
        userId: passwordReset.userId,
      },
    })

    return NextResponse.json({
      message: "Password reset successful"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while resetting your password." },
      { status: 500 }
    )
  }
} 