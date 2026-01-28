'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as React from 'react'

export function OtpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [otp, setOtp] = React.useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('').map(char => char.trim())
    setOtp(newOtp)

    // Focus last filled input
    const lastFilledIndex = newOtp.findIndex(char => !char)
    const focusIndex = lastFilledIndex === -1 ? otp.length - 1 : lastFilledIndex
    inputRefs.current[focusIndex]?.focus()
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Verify your account</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <form onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <div className='flex justify-center gap-2'>
                {otp.map((digit, index) => (
                  <div key={index} className='relative'>
                    <Input
                      ref={el => {
                        if (el) inputRefs.current[index] = el
                      }}
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]'
                      maxLength={1}
                      value={digit}
                      onChange={e => handleInputChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className='h-12 w-12 text-center text-lg font-semibold'
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
              <Button type='submit' disabled={isLoading || !isOtpComplete} className='w-full'>
                {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
                Verify Code
              </Button>
            </div>
          </form>

          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              Didn't receive the code?{' '}
              <Button variant='link' className='h-auto p-0 font-normal'>
                Resend code
              </Button>
            </p>
          </div>

          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>The code will expire in 10 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
