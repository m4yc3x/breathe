import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTOTP } from "@/lib/totp"
import { sendTwoFactorEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let isDisabling = false
    
    // Only try to parse JSON if there's a body
    if (req.headers.get("content-length") !== "0") {
      const json = await req.json()
      isDisabling = json?.action === 'disable'
    }

    // Generate a temporary secret and code for 2FA verification
    const { secret, code, timestamp } = generateTOTP()

    // Store the temporary secret and timestamp
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        twoFactorSecret: `${secret}:${timestamp}`, // Store both secret and timestamp
      },
    })

    // Send verification email
    await sendTwoFactorEmail({
      to: session.user.email!,
      code,
      username: session.user.name || session.user.email!,
      isDisabling,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to setup 2FA" },
      { status: 500 }
    )
  }
} 