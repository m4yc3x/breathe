import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyTOTP } from "@/lib/totp"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const { code } = json

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA setup not initiated" },
        { status: 400 }
      )
    }

    // Extract secret and timestamp
    const [secret, timestamp] = user.twoFactorSecret.split(':')
    const setupTime = parseInt(timestamp)

    // Check if the setup has expired (10 minutes)
    if (!user.twoFactorEnabled && Date.now() - setupTime > 600000) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorSecret: null },
      })
      return NextResponse.json(
        { error: "Verification code has expired. Please try again." },
        { status: 400 }
      )
    }

    // Verify the code
    const isValid = verifyTOTP(code, secret)
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Update user based on current 2FA status
    await prisma.user.update({
      where: { id: session.user.id },
      data: user.twoFactorEnabled
        ? { twoFactorEnabled: false, twoFactorSecret: null }
        : { twoFactorEnabled: true, twoFactorSecret: secret },
    })

    return NextResponse.json({ 
      success: true,
      message: user.twoFactorEnabled 
        ? "Two-factor authentication has been disabled"
        : "Two-factor authentication has been enabled"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to verify 2FA code" },
      { status: 500 }
    )
  }
} 