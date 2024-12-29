"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  KeyRound, 
  Shield, 
  RefreshCw, 
  Mail, 
  UserCog,
  Database,
  Code2,
  Zap
} from "lucide-react"

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-8 min-h-[50vh]">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl w-full"
        >
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Breathe
              </CardTitle>
              <CardDescription className="text-lg">
                Modern Authentication for Next.js Applications
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8">
              <p className="mb-8 text-base text-muted-foreground">
                A complete authentication solution with secure password handling, email verification,
                and account management. Use this as a starting point for your project or just look around!
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className="px-3 py-1">
                        {feature.title}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/ui</p>
          <p className="mt-1">Open source and ready for production</p>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Secure Authentication",
    description: "Industry-standard Argon2 password hashing with secure session management and two-factor authentication.",
    icon: Shield,
  },
  {
    title: "Password Recovery",
    description: "Secure password reset flow with time-limited tokens and email verification.",
    icon: RefreshCw,
  },
  {
    title: "Email Integration",
    description: "Built-in email service integration for password resets and notifications.",
    icon: Mail,
  },
  {
    title: "Account Management",
    description: "User-friendly interface for managing account settings and security preferences.",
    icon: UserCog,
  },
  {
    title: "Database Ready",
    description: "Prisma ORM integration with MySQL support and proper schema design.",
    icon: Database,
  },
  {
    title: "Modern Stack",
    description: "Built with React Server Components, TypeScript, and modern security practices.",
    icon: Zap,
  },
] as const
