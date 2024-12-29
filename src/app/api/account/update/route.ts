import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateAccountSchema } from "@/lib/validations/auth"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const result = updateAccountSchema.safeParse(json)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { name } = result.data

    // Update user name only
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while updating the account." },
      { status: 500 }
    )
  }
} 