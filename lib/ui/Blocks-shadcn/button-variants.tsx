'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import * as React from 'react'

// Button Variants - Size and Style Examples

export function ButtonDefault() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button>Default</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
    </div>
  )
}

export function ButtonSizes() {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <Button size='sm'>Small</Button>
      <Button size='default'>Default</Button>
      <Button size='lg'>Large</Button>
      <Button size='icon'>
        <Icons.gitHub className='h-4 w-4' />
      </Button>
    </div>
  )
}

export function ButtonWithIcon() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button>
        <Icons.gitHub className='mr-2 h-4 w-4' />
        GitHub
      </Button>
      <Button variant='outline'>
        <Icons.google className='mr-2 h-4 w-4' />
        Google
      </Button>
      <Button variant='secondary'>
        <Icons.gitHub className='mr-2 h-4 w-4' />
        Connect
      </Button>
      <Button variant='destructive' size='sm'>
        <Icons.gitHub className='mr-2 h-4 w-4' />
        Delete
      </Button>
    </div>
  )
}

export function ButtonLoading() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button disabled={isLoading} onClick={handleClick}>
        {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
      <Button variant='outline' disabled={isLoading} onClick={handleClick}>
        {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
        {isLoading ? 'Processing...' : 'Process'}
      </Button>
      <Button variant='secondary' disabled={isLoading} onClick={handleClick}>
        {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}

export function ButtonIcon() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button size='icon'>
        <Icons.gitHub className='h-4 w-4' />
      </Button>
      <Button size='icon' variant='outline'>
        <Icons.google className='h-4 w-4' />
      </Button>
      <Button size='icon' variant='secondary'>
        <Icons.gitHub className='h-4 w-4' />
      </Button>
      <Button size='icon' variant='destructive'>
        <Icons.gitHub className='h-4 w-4' />
      </Button>
      <Button size='icon' variant='ghost'>
        <Icons.google className='h-4 w-4' />
      </Button>
    </div>
  )
}

export function ButtonRounded() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button className='rounded-full'>Full Rounded</Button>
      <Button variant='outline' className='rounded-full'>
        Full Rounded
      </Button>
      <Button variant='secondary' className='rounded-full'>
        Full Rounded
      </Button>
      <Button size='icon' className='rounded-full'>
        <Icons.gitHub className='h-4 w-4' />
      </Button>
    </div>
  )
}

export function ButtonAsChild() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button asChild>
        <a href='#'>Link as Button</a>
      </Button>
      <Button variant='outline' asChild>
        <a href='#'>External Link</a>
      </Button>
      <Button variant='secondary' asChild>
        <button type='button'>Custom Button</button>
      </Button>
    </div>
  )
}

// Input Size Variants
export function InputSizes() {
  return (
    <div className='grid w-full max-w-sm gap-4'>
      <Input placeholder='Small input' className='h-8 px-2 text-sm' />
      <Input placeholder='Default input' />
      <Input placeholder='Large input' className='h-12 px-4 text-lg' />
    </div>
  )
}

// Textarea Size Variants
export function TextareaSizes() {
  return (
    <div className='grid w-full max-w-sm gap-4'>
      <Textarea placeholder='Small textarea' className='h-20 px-2 py-1 text-sm' />
      <Textarea placeholder='Default textarea' />
      <Textarea placeholder='Large textarea' className='h-32 px-4 py-3 text-lg' />
    </div>
  )
}

// Select Size Variants
export function SelectSizes() {
  return (
    <div className='grid w-full max-w-sm gap-4'>
      <select className='h-8 rounded-md border border-input bg-background px-2 text-sm'>
        <option>Small select</option>
        <option>Option 2</option>
      </select>
      <select className='h-10 rounded-md border border-input bg-background px-3'>
        <option>Default select</option>
        <option>Option 2</option>
      </select>
      <select className='h-12 rounded-md border border-input bg-background px-4 text-lg'>
        <option>Large select</option>
        <option>Option 2</option>
      </select>
    </div>
  )
}

// Card Size Variants
export function CardSizes() {
  return (
    <div className='grid gap-4'>
      <Card className='w-48 p-4'>
        <CardHeader className='p-0 pb-2'>
          <CardTitle className='text-sm'>Small Card</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <p className='text-xs text-muted-foreground'>Compact card content</p>
        </CardContent>
      </Card>

      <Card className='w-64 p-6'>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Default card content with normal spacing</p>
        </CardContent>
      </Card>

      <Card className='w-80 p-8'>
        <CardHeader>
          <CardTitle className='text-lg'>Large Card</CardTitle>
          <CardDescription className='text-base'>Spacious card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-base'>Large card content with generous spacing and larger text</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Badge Size Variants
export function BadgeSizes() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Badge className='px-1.5 py-0.5 text-xs'>Tiny</Badge>
      <Badge className='text-sm'>Small</Badge>
      <Badge>Default</Badge>
      <Badge className='px-3 py-1.5 text-base'>Large</Badge>
      <Badge className='px-4 py-2 text-lg'>Extra Large</Badge>
    </div>
  )
}

// Avatar Size Variants
export function AvatarSizes() {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <Avatar className='h-6 w-6'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar className='h-8 w-8'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar className='h-10 w-10'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar className='h-12 w-12'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar className='h-16 w-16'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
    </div>
  )
}

// Import missing components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
