import { NextResponse } from "next/server"
import { hash } from "argon2"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    
    const result = registerSchema.safeParse(json)
    
    if (!result.success) {
      const { errors } = result.error
      return NextResponse.json(
        { error: "Invalid input", details: errors },
        { status: 400 }
      )
    }

    const { email, password, name } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while registering the user." },
      { status: 500 }
    )
  }
} 