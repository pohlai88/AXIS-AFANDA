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
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import * as React from 'react'

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <Input
                id='email'
                placeholder='name@example.com'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
              />
            </div>
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='password'>
                Password
              </Label>
              <Input
                id='password'
                placeholder='Password'
                type='password'
                autoCapitalize='none'
                autoComplete='new-password'
                autoCorrect='off'
                disabled={isLoading}
              />
            </div>
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='confirm-password'>
                Confirm Password
              </Label>
              <Input
                id='confirm-password'
                placeholder='Confirm Password'
                type='password'
                autoCapitalize='none'
                autoComplete='new-password'
                autoCorrect='off'
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading} onClick={onSubmit}>
              {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              Create Account
            </Button>
          </div>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
            </div>
          </div>
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
        </CardContent>
        <CardContent className='grid gap-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox id='terms' />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              I agree to the{' '}
              <a href='#' className='text-primary underline-offset-4 hover:underline'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href='#' className='text-primary underline-offset-4 hover:underline'>
                Privacy Policy
              </a>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <div className='text-sm text-muted-foreground'>
            Already have an account?{' '}
            <a href='/login' className='text-primary underline-offset-4 hover:underline'>
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
