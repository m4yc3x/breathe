import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { changePasswordSchema } from "@/lib/validations/auth"
import { hash, verify } from "argon2"

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
    const result = changePasswordSchema.safeParse(json)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = result.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: "Invalid operation" },
        { status: 400 }
      )
    }

    const isValid = await verify(user.hashedPassword, currentPassword)

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(newPassword)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    })

    return NextResponse.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while updating the password." },
      { status: 500 }
    )
  }
} 