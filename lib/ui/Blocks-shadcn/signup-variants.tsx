'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import * as React from 'react'

// Signup Variant 1: Simple Form
export function SignupSimple({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Create account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Input placeholder='Full name' disabled={isLoading} />
            <Input placeholder='Email' type='email' disabled={isLoading} />
            <Input placeholder='Password' type='password' disabled={isLoading} />
            <Button disabled={isLoading} onClick={onSubmit}>
              {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              Sign Up
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>
            Have an account?{' '}
            <a href='/login' className='text-primary hover:underline'>
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Signup Variant 2: Two Column with Image
export function SignupTwoColumn({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card className='overflow-hidden'>
        <div className='grid lg:grid-cols-2'>
          <div className='p-6 lg:p-8'>
            <CardHeader className='space-y-1 p-0'>
              <CardTitle className='text-2xl'>Welcome aboard</CardTitle>
              <CardDescription>Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 p-0'>
              <div className='grid gap-2'>
                <Input placeholder='Full name' disabled={isLoading} />
                <Input placeholder='Email' type='email' disabled={isLoading} />
                <Input placeholder='Password' type='password' disabled={isLoading} />
                <Button disabled={isLoading} onClick={onSubmit}>
                  {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
                  Create Account
                </Button>
              </div>
            </CardContent>
          </div>
          <div className='hidden bg-gradient-to-br from-blue-500 to-purple-600 p-8 lg:block'>
            <div className='flex h-full items-center justify-center'>
              <div className='text-center text-white'>
                <div className='mb-4 text-4xl'>🚀</div>
                <h3 className='text-xl font-semibold'>Start your journey</h3>
                <p className='mt-2 text-sm opacity-90'>
                  Join thousands of users already using our platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Signup Variant 3: Social Providers
export function SignupSocial({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Create account</CardTitle>
          <CardDescription>Choose your preferred sign up method</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Button variant='outline' disabled={isLoading}>
              <Icons.gitHub className='mr-2 h-4 w-4' />
              GitHub
            </Button>
            <Button variant='outline' disabled={isLoading}>
              <Icons.google className='mr-2 h-4 w-4' />
              Google
            </Button>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with email
              </span>
            </div>
          </div>

          <div className='grid gap-2'>
            <Input placeholder='Email' type='email' disabled={isLoading} />
            <Input placeholder='Password' type='password' disabled={isLoading} />
            <Button disabled={isLoading} onClick={onSubmit}>
              {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              Sign Up with Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// OTP Variants
export function OtpSimple({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [otp, setOtp] = React.useState<string[]>(['', '', '', '', '', ''])

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Verify your email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <form onSubmit={onSubmit}>
            <div className='grid gap-4'>
              <div className='flex justify-center gap-2'>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]'
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInputChange(index, e.target.value)}
                    className='h-10 w-10 text-center'
                    disabled={isLoading}
                  />
                ))}
              </div>
              <Button type='submit' disabled={isLoading || !isOtpComplete} className='w-full'>
                {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
                Verify
              </Button>
            </div>
          </form>
          <p className='text-center text-sm text-muted-foreground'>
            Didn't receive code?{' '}
            <Button variant='link' className='h-auto p-0'>
              Resend
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
