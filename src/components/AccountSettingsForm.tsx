"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { User } from "next-auth"
import { updateAccountSchema } from "@/lib/validations/auth"
import type { UpdateAccountInput } from "@/lib/validations/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Mail, KeyRound, Shield } from "lucide-react"
import { ChangePasswordModal } from "./ChangePasswordModal"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AccountSettingsFormProps {
  user: User
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: user.name || "",
    },
  })

  const onSubmit = async (data: UpdateAccountInput) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update account")
      }

      await update(responseData.user)
      toast.success("Account updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update account", {
        description: error instanceof Error ? error.message : "Something went wrong!",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ... rest of your JSX remains the same ... */}
    </motion.div>
  )
} 