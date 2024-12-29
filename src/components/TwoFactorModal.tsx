"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits").regex(/^\d+$/, "Code must contain only numbers")
})

type TwoFactorInput = z.infer<typeof twoFactorSchema>

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
  isEnabled: boolean
  onSuccess: (success: boolean) => void
}

export function TwoFactorModal({ isOpen, onClose, isEnabled, onSuccess }: TwoFactorModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'initial' | 'verify' | 'disable'>('initial')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
  })

  const handleInitiate2FA = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/account/2fa/setup', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to initiate 2FA setup')
      }

      toast.success('Verification code sent to your email')
      setStep('verify')
    } catch (error) {
      toast.error('Failed to initiate 2FA setup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitiateDisable2FA = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/account/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable' }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate 2FA disable')
      }

      toast.success('Verification code sent to your email')
      setStep('disable')
    } catch (error) {
      toast.error('Failed to initiate 2FA disable')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: TwoFactorInput) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/account/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: data.code,
          action: step === 'disable' ? 'disable' : 'enable',
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid verification code')
      }

      toast.success(step === 'disable' ? '2FA has been disabled' : '2FA has been enabled')
      onSuccess(true)
      reset()
      onClose()
      setStep('initial')
    } catch (error) {
      toast.error('Verification failed')
      onSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('initial')
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
          </DialogTitle>
          {step === 'initial' && (
            <DialogDescription>
              {isEnabled
                ? 'Disabling 2FA will make your account less secure'
                : 'Add an extra layer of security to your account'}
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'initial' ? (
          <div className="space-y-4">
            {isEnabled && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Disabling two-factor authentication will make your account more vulnerable to unauthorized access.
                </AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              {isEnabled
                ? 'To disable 2FA, you need to verify your identity first. We will send a code to your email.'
                : 'Enable two-factor authentication to add an extra layer of security to your account.'}
            </p>
            <Button
              onClick={isEnabled ? handleInitiateDisable2FA : handleInitiate2FA}
              className="w-full"
              disabled={isLoading}
              variant={isEnabled ? "destructive" : "default"}
            >
              {isLoading ? 'Processing...' : isEnabled ? 'Proceed with Disabling 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...register('code')}
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              variant={step === 'disable' ? "destructive" : "default"}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 