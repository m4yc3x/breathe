"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { LoginInput } from '@/lib/validations/auth'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import { LoginTwoFactorModal } from './LoginTwoFactorModal'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState<LoginInput | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error === 'TwoFactorRequired') {
        setLoginCredentials(data)
        setShowTwoFactor(true)
        // Don't close the modal or show success message yet
        return
      }

      if (result?.error) {
        throw new Error('Invalid credentials')
      }

      toast.success('Login successful!', {
        description: 'Welcome back!',
      })
      
      reset()
      onClose()
      router.refresh()
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Something went wrong!',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorVerify = async (code: string) => {
    if (!loginCredentials) return

    const result = await signIn('credentials', {
      email: loginCredentials.email,
      password: loginCredentials.password,
      twoFactorCode: code,
      redirect: false,
    })

    if (result?.error) {
      throw new Error('Invalid verification code')
    }

    toast.success('Login successful!', {
      description: 'Welcome back!',
    })
    
    reset()
    onClose()
    router.refresh()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                onClose()
                setShowForgotPassword(true)
              }}
            >
              Forgot Password?
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <LoginTwoFactorModal
        isOpen={showTwoFactor}
        onClose={() => setShowTwoFactor(false)}
        onVerify={handleTwoFactorVerify}
        email={loginCredentials?.email || ''}
      />
    </>
  )
}
