"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { updateAccountSchema } from "@/lib/validations/auth"
import type { UpdateAccountInput } from "@/lib/validations/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Mail, KeyRound, Shield } from "lucide-react"
import { ChangePasswordModal } from "./ChangePasswordModal"
import type { User } from "next-auth"
import { TwoFactorModal } from "./TwoFactorModal"

interface ExtendedUser extends User {
  twoFactorEnabled: boolean
}

export function AccountSettings() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [userData, setUserData] = useState<ExtendedUser | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
  })

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/account/me')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setUserData(data.user)
        reset({
          name: data.user.name || "",
        })
      } catch (error) {
        toast.error("Failed to load user data")
      }
    }

    if (session?.user) {
      fetchUserData()
    }
  }, [session, reset])

  const handleTwoFactorUpdate = async (success: boolean) => {
    if (success) {
      const response = await fetch('/api/account/me')
      const data = await response.json()
      
      if (response.ok) {
        setUserData(data.user)
        await update({
          ...session,
          user: {
            ...session?.user,
            twoFactorEnabled: data.user.twoFactorEnabled,
          },
        })
      }
    }
  }

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

      setUserData(responseData.user)
      toast.success("Account updated successfully")
    } catch (error) {
      toast.error("Failed to update account", {
        description: error instanceof Error ? error.message : "Something went wrong!",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userData) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-9"
                        {...register("name")}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9 bg-muted"
                        value={userData?.email || ""}
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Changing your email is not allowed for security reasons.
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowTwoFactorModal(true)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {userData?.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
      />

      <TwoFactorModal 
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        isEnabled={userData?.twoFactorEnabled ?? false}
        onSuccess={handleTwoFactorUpdate}
      />
    </div>
  )
} 