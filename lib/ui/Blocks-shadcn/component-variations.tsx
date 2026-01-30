'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import * as React from 'react'

// Complete Component Variations System - Final Clean Version

export function ComponentVariationsShowcase() {
  return (
    <div className='space-y-8'>
      <div>
        <h3 className='mb-4 text-lg font-semibold'>Alert Variations</h3>
        <AlertVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Badge Variations</h3>
        <BadgeVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Avatar Variations</h3>
        <AvatarVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Form Variations</h3>
        <FormVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Progress Variations</h3>
        <ProgressVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Interactive Variations</h3>
        <InteractiveVariations />
      </div>
    </div>
  )
}

// Alert Variations
export function AlertVariations() {
  return (
    <div className='space-y-4'>
      <Alert>
        <Icons.gitHub className='h-4 w-4' />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert message with icon and description.
        </AlertDescription>
      </Alert>

      <Alert variant='destructive'>
        <Icons.gitHub className='h-4 w-4' />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is a destructive alert for error messages.</AlertDescription>
      </Alert>

      <Alert className='border-blue-200 bg-blue-50'>
        <Icons.gitHub className='h-4 w-4 text-blue-600' />
        <AlertTitle className='text-blue-800'>Info Alert</AlertTitle>
        <AlertDescription className='text-blue-700'>
          This is an informational alert with custom styling.
        </AlertDescription>
      </Alert>

      <Alert className='border-green-200 bg-green-50'>
        <Icons.gitHub className='h-4 w-4 text-green-600' />
        <AlertTitle className='text-green-800'>Success Alert</AlertTitle>
        <AlertDescription className='text-green-700'>
          This is a success alert for confirmation messages.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Badge Variations
export function BadgeVariations() {
  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Badge>Default</Badge>
        <Badge variant='secondary'>Secondary</Badge>
        <Badge variant='destructive'>Destructive</Badge>
        <Badge variant='outline'>Outline</Badge>
      </div>

      <div className='flex gap-2'>
        <Badge className='bg-red-500'>Red</Badge>
        <Badge className='bg-green-500'>Green</Badge>
        <Badge className='bg-blue-500'>Blue</Badge>
        <Badge className='bg-yellow-500'>Yellow</Badge>
        <Badge className='bg-purple-500'>Purple</Badge>
      </div>

      <div className='flex gap-2'>
        <Badge className='px-1.5 py-0.5 text-xs'>Tiny</Badge>
        <Badge className='text-sm'>Small</Badge>
        <Badge className='px-3 py-1.5 text-base'>Large</Badge>
        <Badge className='px-4 py-2 text-lg'>Extra Large</Badge>
      </div>

      <div className='flex gap-2'>
        <Badge className='rounded-full'>Rounded</Badge>
        <Badge className='rounded-none'>Square</Badge>
        <Badge className='rounded-lg'>Rounded LG</Badge>
      </div>
    </div>
  )
}

// Avatar Variations
export function AvatarVariations() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
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

      <div className='flex gap-4'>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar className='rounded-lg'>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar className='border-2 border-primary'>
          <AvatarFallback>XY</AvatarFallback>
        </Avatar>
      </div>

      <div className='flex gap-4'>
        <Avatar>
          <div className='h-full w-full bg-linear-to-br from-blue-500 to-purple-600' />
        </Avatar>
        <Avatar>
          <div className='h-full w-full bg-linear-to-br from-green-500 to-teal-600' />
        </Avatar>
        <Avatar>
          <div className='h-full w-full bg-linear-to-br from-red-500 to-orange-600' />
        </Avatar>
      </div>
    </div>
  )
}

// Form Variations
export function FormVariations() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label>Input States</Label>
        <div className='space-y-2'>
          <Input placeholder='Default input' />
          <Input placeholder='Disabled input' disabled />
          <Input placeholder='Error input' className='border-red-500' />
          <Input placeholder='Success input' className='border-green-500' />
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Input with Icons</Label>
        <div className='relative'>
          <Icons.gitHub className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
          <Input placeholder='Search...' className='pl-10' />
        </div>
        <div className='relative'>
          <Input placeholder='Password' type='password' />
          <Button
            size='sm'
            variant='ghost'
            className='absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform'
          >
            <Icons.gitHub className='h-3 w-3' />
          </Button>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Textarea Variations</Label>
        <Textarea placeholder='Default textarea' />
        <Textarea placeholder='Disabled textarea' disabled />
        <Textarea placeholder='Error textarea' className='border-red-500' />
      </div>

      <div className='space-y-2'>
        <Label>Select Variations</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Default select' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className='border-red-500'>
            <SelectValue placeholder='Error select' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Progress Variations
export function ProgressVariations() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Default Progress</Label>
        <Progress value={25} />
      </div>

      <div className='space-y-2'>
        <Label>Progress Variants</Label>
        <Progress value={50} className='bg-blue-100' />
        <Progress value={75} className='bg-green-100' />
        <Progress value={90} className='bg-red-100' />
      </div>

      <div className='space-y-2'>
        <Label>Progress Sizes</Label>
        <Progress value={33} className='h-1' />
        <Progress value={50} />
        <Progress value={66} className='h-3' />
        <Progress value={80} className='h-4' />
      </div>

      <div className='space-y-2'>
        <Label>Indeterminate Progress</Label>
        <Progress className='animate-pulse' />
      </div>
    </div>
  )
}

// Interactive Variations - Final Clean Version
export function InteractiveVariations() {
  // Use proper boolean state management
  const [switch1, setSwitch1] = React.useState(false)
  const [switch3, setSwitch3] = React.useState(false)

  const [checkbox1, setCheckbox1] = React.useState(false)
  const [checkbox3, setCheckbox3] = React.useState(false)

  const [sliderValue, setSliderValue] = React.useState([50])

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Switch Variations</Label>
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Switch checked={switch1} onCheckedChange={setSwitch1} />
            <Label>Default switch</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch checked={true} disabled />
            <Label>Disabled switch</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              checked={switch3}
              onCheckedChange={setSwitch3}
              className='data-[state=checked]:bg-green-500'
            />
            <Label>Custom color</Label>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <Label>Checkbox Variations</Label>
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              checked={checkbox1}
              onCheckedChange={checked => setCheckbox1(checked as boolean)}
            />
            <Label>Default checkbox</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={true} disabled />
            <Label>Disabled checkbox</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              checked={checkbox3}
              onCheckedChange={checked => setCheckbox3(checked as boolean)}
              className='data-[state=checked]:bg-green-500'
            />
            <Label>Custom color</Label>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <Label>Slider Variations</Label>
        <div className='space-y-4'>
          <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          <Slider value={[25, 75]} max={100} step={1} />
          <Slider value={[33]} max={100} step={1} disabled />
          <Slider value={[50]} max={100} step={1} className='**:[[role=slider]]:bg-green-500' />
        </div>
      </div>

      <div className='space-y-4'>
        <Label>Tabs Variations</Label>
        <Tabs defaultValue='tab1' className='w-full'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
            <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>
            <Card>
              <CardHeader>
                <CardTitle>Tab 1 Content</CardTitle>
                <CardDescription>Content for the first tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 1.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='tab2'>
            <Card>
              <CardHeader>
                <CardTitle>Tab 2 Content</CardTitle>
                <CardDescription>Content for the second tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 2.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='tab3'>
            <Card>
              <CardHeader>
                <CardTitle>Tab 3 Content</CardTitle>
                <CardDescription>Content for the third tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 3.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Advanced Component Variations
export function AdvancedVariations() {
  return (
    <div className='space-y-8'>
      <div>
        <h3 className='mb-4 text-lg font-semibold'>Card Variations</h3>
        <CardVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Separator Variations</h3>
        <SeparatorVariations />
      </div>

      <div>
        <h3 className='mb-4 text-lg font-semibold'>Loading Variations</h3>
        <LoadingVariations />
      </div>
    </div>
  )
}

// Card Variations
export function CardVariations() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Simple Card</CardTitle>
          <CardDescription>Basic card layout</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a simple card with header and content.</p>
        </CardContent>
      </Card>

      <Card className='border-none shadow-lg'>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with elevation and no border.</p>
        </CardContent>
      </Card>

      <Card className='border-none bg-linear-to-br from-blue-500 to-purple-600 text-white'>
        <CardHeader>
          <CardTitle className='text-white'>Gradient Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-white'>Card with gradient background.</p>
        </CardContent>
      </Card>

      <Card className='border-2 border-dashed'>
        <CardHeader>
          <CardTitle>Dashed Border</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with dashed border styling.</p>
        </CardContent>
      </Card>

      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle>Square Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with square corners (no radius).</p>
        </CardContent>
      </Card>

      <Card className='overflow-hidden'>
        <div className='h-24 bg-linear-to-r from-blue-500 to-purple-600' />
        <CardHeader>
          <CardTitle>Card with Image</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with header image area.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Separator Variations
export function SeparatorVariations() {
  return (
    <div className='space-y-4'>
      <div>
        <Label>Default Separator</Label>
        <Separator />
      </div>

      <div>
        <Label>Vertical Separator</Label>
        <div className='flex items-center'>
          <span>Item 1</span>
          <Separator orientation='vertical' className='mx-4' />
          <span>Item 2</span>
        </div>
      </div>

      <div>
        <Label>Custom Color Separator</Label>
        <Separator className='bg-blue-500' />
      </div>

      <div>
        <Label>Dashed Separator</Label>
        <Separator className='border-dashed' />
      </div>
    </div>
  )
}

// Loading Variations
export function LoadingVariations() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <Icons.spinner className='h-4 w-4 animate-spin' />
        <span>Loading...</span>
      </div>

      <div className='flex items-center space-x-2'>
        <Icons.spinner className='h-6 w-6 animate-spin' />
        <span className='text-lg'>Loading large...</span>
      </div>

      <div className='flex items-center space-x-2'>
        <Icons.spinner className='h-8 w-8 animate-spin text-blue-500' />
        <span className='text-xl'>Loading with color...</span>
      </div>

      <div className='space-y-2'>
        <div className='h-2 animate-pulse rounded bg-muted' />
        <div className='h-2 w-3/4 animate-pulse rounded bg-muted' />
        <div className='h-2 w-1/2 animate-pulse rounded bg-muted' />
      </div>
    </div>
  )
}
