import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { verify } from "argon2"
import crypto from "crypto"
import { generateTOTP } from "./totp"
import { sendTwoFactorEmail } from "./email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text", optional: true }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              hashedPassword: true,
              twoFactorEnabled: true,
              twoFactorSecret: true,
            }
          })

          if (!user || !user.hashedPassword) {
            return null
          }

          const isPasswordValid = await verify(
            user.hashedPassword,
            credentials.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Check if 2FA is enabled
          if (user.twoFactorEnabled) {
            // If no 2FA code provided, generate and send a new code
            if (!credentials.twoFactorCode) {
              const { code, timestamp } = generateTOTP()
              
              // Store the code with timestamp
              await prisma.user.update({
                where: { id: user.id },
                data: { 
                  twoFactorSecret: `login:${code}:${timestamp}` // Add prefix to distinguish login codes
                }
              })
              
              // Send the code via email
              await sendTwoFactorEmail({
                to: user.email!,
                code,
                username: user.name || user.email!,
                isLogin: true,
              })

              throw new Error('TwoFactorRequired')
            }

            // Verify 2FA code
            if (!user.twoFactorSecret?.startsWith('login:')) {
              return null // Invalid state
            }

            const [prefix, storedCode, timestampStr] = user.twoFactorSecret.split(':')
            const timestamp = parseInt(timestampStr)

            // Check if the code has expired (10 minutes)
            if (Date.now() - timestamp > 600000) {
              return null
            }

            // Verify the provided code matches the stored code
            if (credentials.twoFactorCode !== storedCode) {
              return null
            }

            // Clear the login verification code
            await prisma.user.update({
              where: { id: user.id },
              data: {
                twoFactorSecret: user.twoFactorSecret.replace('login:', '2fa:') // Restore original 2FA secret
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          // If it's our 2FA error, rethrow it
          if (error instanceof Error && error.message === 'TwoFactorRequired') {
            throw error
          }
          // For other errors, return null to indicate auth failure
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
} 

export async function validateResetToken(token: string) {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
    })

    return !!passwordReset
  } catch {
    return false
  }
} 